import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { SelectService } from "./SelectService";
import { SelectStaff } from "./SelectStaff";
import { DateTime } from "./DateTime"
import { useMutation, useQuery } from "@tanstack/react-query";
import { createRazorpayOrder, verifyRazorpayPayment } from "../../API/payment.api";
import { fetchServices, fetchStaff } from "../../API/service.api";
import { bookAppointmentApi } from "../../API/appointment.api";
import { createBillApi } from "../../API/bill.api";
import toast from "react-hot-toast";


export const Booking = () => {

  //  ALL useState 

  const [selectedService, setSelectedService] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);


  //  Router hooks
  const [searchParams] = useSearchParams();
  const preSelectedService = searchParams.get("service");
  const preSelectedStaff = searchParams.get("staff");

  // useQuery hooks
  const {
    data: services = [],
    isPending: servicesLoading,
    isError: servicesError,
    error: servicesErrorData,
    refetch: refetchServices,
  } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: staffs = [],
    isPending: staffLoading,
    isError: staffError,
    error: staffErrorData,
    refetch: refetchStaff,
  } = useQuery({
    queryKey: ["staffs"],
    queryFn: fetchStaff,
    staleTime: 5 * 60 * 1000,
  });

  //  useEffect hooks

  // Pre-select service from URL param
  useEffect(() => {
    if (!preSelectedService || !services.length) return;
    const found = services.find((s) => s._id === preSelectedService);
    if (found) setSelectedService(found);
  }, [preSelectedService, services]);

  // Pre-select staff from URL param
  useEffect(() => {
    if (!preSelectedStaff || !staffs.length) return;
    const found = staffs.find((s) => s._id === preSelectedStaff);
    if (found) setSelectedStaff(found);
  }, [preSelectedStaff, staffs]); // ✅ staffs added (was missing before)

  //  useMutation — must be before early returns
  const mutation = useMutation({
    mutationFn: async ({ data, token, paymentMode }) => {
      const bookingRes = await bookAppointmentApi(data, token);

      const billRes = await createBillApi({
        appointmentId: bookingRes.appointment._id,
        paymentMode
      }, token);

      return { bookingRes, billRes };
    },

    onSuccess: (response) => {
      setShowConfirmModal(false);
      setSelectedDate(null);
      setSelectedTime(null);
      setIsProcessingPayment(false);
      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? "toast-enter" : "toast-leave"
              } backdrop-blur-lg bg-white/20 border border-white/30
            shadow-2xl rounded-2xl px-8 py-6
            flex items-center justify-between gap-6
            text-white max-w-xl w-full`}
          >
            <div className="flex-1">
              <h3 className="text-2xl font-semibold tracking-wide">
                Booking Confirmed
              </h3>
              <p className="text-xl opacity-90 mt-1">
                {response?.bookingRes?.message || "Your appointment is scheduled successfully."}
              </p>
            </div>
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500 shadow-lg">
              <span className="text-3xl font-bold text-white">✓</span>
            </div>
          </div>
        ),
        { duration: 3500 }
      );
    },

    onError: (error) => {
      console.error("Booking Error:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    },
  });

  //  Derived values & handlers
  //    (not hooks — safe after hooks)
  const totalPrice = selectedService
    ? Number(String(selectedService.priceFrom).replace(/[₹,]/g, ""))
    : 0;

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours % 12 || 12;
    return `${formattedHour}:${mins === 0 ? "00" : mins} ${ampm}`;
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setSelectedStaff(null); // reset staff when service changes
  };

  const handleStaffClick = (staff) => {
    setSelectedStaff((prev) => (prev?._id === staff._id ? null : staff));
  };

  const handleDateClick = (date) => {
    setSelectedDate((prev) => (prev === date ? null : date));
    // setSelectedTime(null);
  }

  const handleTimeClick = (time) => {
    setSelectedTime((prev) => (prev === time ? null : time));
  }

  const handleBooking = () => {
    if (!selectedService || !selectedStaff || !selectedDate || !selectedTime) {
      toast.error("Please complete all selections");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleRazorpayCheckout = async () => {
    try {
      setIsProcessingPayment(true);
      const token = localStorage.getItem("token");

      // 1. Create Order
      const orderRes = await createRazorpayOrder(totalPrice);
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_Sa46S6KUfLMAku",
        amount: orderRes.order.amount,
        currency: "INR",
        name: "Salon Booking",
        description: `Booking for ${selectedService.name}`,
        order_id: orderRes.order.id,
        handler: async function (response) {
            try {
                // 2. Verify Payment
                await verifyRazorpayPayment({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                });

                // 3. Book Appointment and Create Bill internally
                mutation.mutate({
                  data: {
                    serviceId: selectedService._id,
                    staffId: selectedStaff._id,
                    date: selectedDate,
                    startTime: selectedTime,
                  },
                  token,
                  paymentMode: "Online"
                });

            } catch (err) {
                toast.error("Payment verification failed");
                setIsProcessingPayment(false);
            }
        },
        theme: { color: "#16a34a" }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
          toast.error("Payment failed. Please try again.");
          setIsProcessingPayment(false);
      });
      rzp1.open();

    } catch (error) {
      toast.error("Error initiating payment");
      setIsProcessingPayment(false);
    }
  };

  // 7. EARLY RETURNS — only after ALL hooks
  if (servicesLoading || staffLoading)
    return <p className="p-4">Loading...</p>;

  if (servicesError)
    return (
      <div className="p-4">
        <p>Error: {servicesErrorData.message}</p>
        <button onClick={refetchServices}>Retry</button>
      </div>
    );

  if (staffError)
    return (
      <div className="p-4">
        <p>Error: {staffErrorData.message}</p>
        <button onClick={refetchStaff}>Retry</button>
      </div>
    );

  return (

    <section className="bg-bg-main">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-15 mx-2">

          {/* SERVICE + STAFF */}
          <div>
            <SelectService
              services={services}
              selectedService={selectedService}
              onServiceSelect={handleServiceClick}
            />

            <p className="mt-2 text-xl">
              want to know about detailed services?
              <NavLink to={"/services"}>
                <span className="text-xl text-blue-600 hover:text-blue-800">
                  {" "}click here.
                </span>
              </NavLink>
            </p>

            <h1 className="text-3xl mt-5 font-semibold">
              Select your staff
            </h1>

            <SelectStaff
              staffs={staffs}
              selectedService={selectedService}
              selectedStaff={selectedStaff}
              onStaffSelect={handleStaffClick}
            />
          </div>

          {/* DATE TIME */}
          <div>
            <DateTime
              selectedService={selectedService}
              selectedStaff={selectedStaff}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateSelect={handleDateClick}
              onTimeSelect={handleTimeClick}
            />
          </div>

          {/* SUMMARY */}
          <div className="relative mt-10 bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8 h-fit overflow-hidden">

            {/* Glow Background */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-green-400/20 rounded-full blur-3xl"></div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-800 mb-6 tracking-tight">
              Booking Summary
            </h2>

            {/* Service */}
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-500">Service</span>
              <span className="font-semibold text-gray-800">
                {selectedService?.name || "Not selected"}
              </span>
            </div>

            {/* Staff */}
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-500">Staff</span>
              <span className="font-semibold text-gray-800">
                {selectedStaff?.name || "Not selected"}
              </span>
            </div>

            {/* Date */}
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-500">Date</span>
              <span className="font-semibold text-gray-800">
                {selectedDate || "Not selected"}
              </span>
            </div>

            {/* Time */}
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-500">Time</span>
              <span className="font-semibold text-gray-800">
                {selectedTime ? formatTime(selectedTime) : "Not selected"}
              </span>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center py-6">
              <span className="text-xl font-semibold text-gray-700">
                Total
              </span>
              <span className="text-3xl font-bold text-text-heading animate-price">
                ₹{totalPrice}
              </span>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleBooking}
              disabled={
                mutation.isPending ||
                !selectedService ||
                !selectedStaff ||
                !selectedDate ||
                !selectedTime
              }
              className="w-full mt-4 py-4 rounded-xl text-lg font-semibold 
    bg-linear-to-r from-primary-soft to-primary
    text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] 
    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? "Processing..." : "Confirm Booking"}
            </button>

          </div>

        </div>
      </div>
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">

          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl animate-modal">

            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              Confirm Booking
            </h2>

            <div className="space-y-4 text-gray-600">
              <p className="text-2xl"><strong>Service:</strong> {selectedService?.name}</p>
              <p className="text-2xl"><strong>Staff:</strong> {selectedStaff?.name}</p>
              <p className="text-2xl"><strong>Date:</strong> {selectedDate}</p>
              <p className="text-2xl"><strong>Time:</strong> {formatTime(selectedTime)}</p>
              <p className="text-2xl border-t pt-4 mt-4 text-gray-800"><strong>Total Amount:</strong> ₹{totalPrice}</p>
            </div>

            <div className="flex justify-end gap-6 mt-10">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={mutation.isPending || isProcessingPayment}
                className="px-6 py-4 text-2xl rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleRazorpayCheckout}
                disabled={mutation.isPending || isProcessingPayment}
                className="px-6 py-4 text-2xl rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 min-w-[160px]"
              >
                {mutation.isPending || isProcessingPayment ? "Processing..." : "Pay Securely Online"}
              </button>
            </div>

          </div>
        </div>
      )}


    </section>
  );
};