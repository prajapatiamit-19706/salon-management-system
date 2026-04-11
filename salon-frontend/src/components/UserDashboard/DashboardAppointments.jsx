import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchUserDashboard } from "../../API/dashboard.api";
import { InvoiceButton } from "./InvoiceButton";
import { cancelAppointmentApi } from "../../API/appointment.api";
import toast from "react-hot-toast";
import { LoadingSpinner } from "../LoadingSpinner";




const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}:${mins === 0 ? "00" : mins} ${ampm}`;
};



const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

// ── Status badge ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const config = {
    upcoming: "bg-emerald-50 text-emerald-600 border-emerald-200",
    completed: "bg-bg-panel text-text-body border-border-soft",
    cancelled: "bg-red-50 text-red-500 border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold capitalize ${config[status]}`}>
      {status === "upcoming" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
      {status === "completed" && <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />}
      {status === "cancelled" && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
      {status}
    </span>
  );
};



// ── Info Cell ─────────────────────────────────────────────────
const InfoCell = ({ label, children }) => (
  <div className="bg-bg-soft border border-border-soft rounded-xl px-4 py-3 text-center flex flex-col items-center justify-center gap-1">
    <p className="text-text-muted text-[13px] font-bold tracking-[2px] uppercase">{label}</p>
    <div className="text-text-heading font-bold text-xl">{children}</div>
  </div>
);


// ── Appointment Card ─────────────────────────────────────────
const AppointmentCard = ({ item, status, user, setCancelModal, setSelectedAppointment }) => (
  <div className="bg-bg-main border border-border-soft rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300">

    {/* ── Top row: salon name + confirmed badge ── */}
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-bg-panel border border-border-soft flex items-center justify-center text-2xl shrink-0">
          💇
        </div>
        <div>
          <h3 className="text-text-heading font-bold text-xl leading-tight">
            {item.serviceId?.name ?? "Service"}
          </h3>
          <p className="text-text-muted text-md mt-1">
            with <span className="text-text-body font-medium">{item.staffId?.name ?? "—"}</span>
          </p>
        </div>
      </div>
      <StatusBadge status={status} />
    </div>

    {/* ── Divider ── */}
    <div className="h-px bg-border-soft mb-4" />

    {/* ── Info grid ── */}
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">

      {/* Date */}
      <div className="bg-bg-soft border border-border-soft rounded-xl px-4 py-3 text-center">
        <p className="text-text-muted text-[10px] font-bold tracking-[2px] uppercase mb-2">Date</p>
        <p className="text-text-heading font-bold text-xl">{formatDate(item.date)}</p>
      </div>

      {/* Time */}
      <div className="bg-bg-soft border border-border-soft rounded-xl px-4 py-3 text-center">
        <p className="text-text-muted text-[10px] font-bold tracking-[2px] uppercase mb-2">Time</p>
        <p className="text-text-heading font-bold text-xl">{formatTime(item.startTime)}</p>
      </div>

      {/* Price */}
      <div className="bg-bg-soft border border-border-soft rounded-xl px-4 py-3 text-center">
        <p className="text-text-muted text-[10px] font-bold tracking-[2px] uppercase mb-2">Price</p>
        <p className="text-primary font-bold text-xl">₹{item.price}</p>
      </div>

      {/* cancel appointment  */}
      <div className="bg-bg-soft border border-border-soft rounded-xl px-4 py-3 text-center">
        <p className="text-text-muted text-[10px] font-bold tracking-[2px] uppercase mb-2">Cancel</p>
        <button className="px-4 py-1 bg-red-600 text-white rounded-lg text-mb mt-2"
          onClick={() => {
            setSelectedAppointment(item);
            setCancelModal(true);
          }} >
          Cancel Booking
        </button>
      </div>

      {/* Invoice / Review */}
      <div className="bg-bg-soft border border-border-soft rounded-xl px-4 py-3 text-center flex flex-col items-center justify-center">
        <p className="text-text-muted text-[10px] font-bold tracking-[2px] uppercase mb-2">Invoice</p>
        <InvoiceButton appointment={item} user={user} />
      </div>
    </div>
  </div>
);


//  History Card (completed = invoice shown, cancelled = no invoice, no cancel) ──
const HistoryCard = ({ item, user }) => {
  const isCompleted = item._status === "completed";

  return (
    <div className={`bg-bg-main border rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300
      ${isCompleted ? "border-border-soft" : "border-red-100"}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl shrink-0
            ${isCompleted ? "bg-bg-panel border-border-soft" : "bg-red-50 border-red-100"}`}
          >
            {isCompleted ? "✅" : "❌"}
          </div>
          <div>
            <h3 className="text-text-heading font-bold text-xl leading-tight">
              {item.serviceId?.name ?? "Service"}
            </h3>
            <p className="text-text-muted text-md mt-0.5">
              with <span className="text-text-body font-medium">{item.staffId?.name ?? "—"}</span>
            </p>
          </div>
        </div>
        <StatusBadge status={item._status} />
      </div>

      <div className={`h-px mb-4 ${isCompleted ? "bg-border-soft" : "bg-red-100"}`} />

      {/* Info grid */}
      <div className={`grid gap-3 ${isCompleted ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3"}`}>
        <InfoCell label="Date">{formatDate(item.date)}</InfoCell>
        <InfoCell label="Time">{formatTime(item.startTime)}</InfoCell>
        <InfoCell label="Price">
          <span className={isCompleted ? "text-primary" : "text-red-400 line-through"}>
            ₹{item.price}
          </span>
        </InfoCell>
      </div>

      {/* ✅ Invoice only for completed */}
      {isCompleted && (
        <div className="mt-4 flex items-center justify-between p-3 bg-bg-soft border border-border-soft rounded-xl">
          <div>
            <p className="text-text-heading text-xl font-semibold">Service Completed</p>
            <p className="text-text-muted text-md">Download your invoice below</p>
          </div>
          <InvoiceButton appointment={item} user={user} />
        </div>
      )}

      {/* ❌ Cancelled notice — no invoice, no cancel */}
      {!isCompleted && (
        <div className="mt-4 flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
          <span className="text-red-400 text-2xl shrink-0">⚠️</span>
          <p className="text-red-500 text-xl font-medium">
            This appointment was cancelled. No invoice available.
          </p>
        </div>
      )}
    </div>
  );
};


// ── Main Component ────────────────────────────────────────────
export const DashboardAppointments = () => {

  const token = localStorage.getItem("token");
  const [tab, setTab] = useState("upcoming");
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery({
    queryKey: ["dashboardAppointments"],
    queryFn: () => fetchUserDashboard(token),
  });


  useEffect(() => {
    if (cancelModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [cancelModal]);

  const cancelMutation = useMutation({

    mutationFn: ({ id, token }) =>
      cancelAppointmentApi(id, token),

    onSuccess: (data) => {
      toast.success(data.message || "Appointment cancelled");

      // 🔄 Refetch dashboard data
      queryClient.invalidateQueries({
        queryKey: ["dashboardAppointments"]
      });
      setCancelModal(false);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        "Cancel failed"
      );
    }
  });

  const confirmCancel = () => {
    ;

    cancelMutation.mutate({
      id: selectedAppointment._id,
      token
    });

  };
  //  if (isPending)
  //     return (
  //       <div className="min-h-screen bg-bg-soft flex items-center justify-center">
  //         <div className="flex flex-col items-center gap-4">
  //           <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
  //           <p className="text-text-muted text-xs tracking-widest uppercase font-mono">
  //             Loading appointments
  //           </p>
  //         </div>
  //       </div>
  //     );

  if (isPending) return <LoadingSpinner />;

  if (isError)
    return (
      <div className="min-h-screen bg-bg-soft flex items-center justify-center">
        <p className="text-red-400 text-sm tracking-widest uppercase font-mono">
          Failed to load appointments
        </p>
      </div>
    );

  const upcoming = data?.upcomingAppointments ?? [];
  const user = data?.user ?? null;
  // History = completed + cancelled merged
  const history = [
    ...(data?.completedAppointments ?? []).map((a) => ({ ...a, _status: "completed" })),
    ...(data?.cancelledAppointments ?? []).map((a) => ({ ...a, _status: "cancelled" })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const current = tab === "upcoming" ? upcoming : history;
  const upcomingCnt = upcoming.length;
  const historyCnt = history.length;

  return (
    <div className="min-h-screen bg-bg-soft p-6 lg:p-10">
      <div className="w-full max-w-5xl mx-auto">

        {/* ── Page header ── */}
        <div className="mb-8">
          <p className="text-text-muted text-[11px] font-bold tracking-[3px] uppercase mb-2">
            Client Portal
          </p>
          <h1 className="text-text-heading text-3xl sm:text-4xl font-bold leading-tight">
            My <span className="italic font-light text-primary-soft">Appointments</span>
          </h1>
        </div>

        {/* ── Tab bar ── */}
        <div className="flex border-b-2 border-border-soft mb-8">
          {[
            { id: "upcoming", label: "Upcoming", count: upcomingCnt },
            { id: "history", label: "History", count: historyCnt },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative px-6 py-3 text-2xl font-semibold transition-all duration-200 flex items-center gap-2
                ${tab === t.id
                  ? "text-primary"
                  : "text-text-muted hover:text-text-body"
                }`}
            >
              {t.label}
              <span className={`text-2xl px-2 py-0.5 rounded-full font-bold
                ${tab === t.id
                  ? "bg-bg-panel text-primary"
                  : "bg-bg-soft text-text-muted"
                }`}>
                {t.count}
              </span>
              {/* Active underline */}
              {tab === t.id && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ── Empty state ── */}
        {current.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 rounded-full bg-bg-panel border border-border-soft flex items-center justify-center text-4xl">
              {tab === "upcoming" ? "🗓️" : "📋"}
            </div>
            <p className="text-text-muted text-base font-mono tracking-widest uppercase">
              No {tab} appointments
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {tab === "upcoming"
              ? upcoming.map((item) => (
                <AppointmentCard key={item._id} item={item} user={user} cancelMutation={cancelMutation}
                  cancelModal={cancelModal} setCancelModal={setCancelModal} selectedAppointment={selectedAppointment} setSelectedAppointment={setSelectedAppointment}
                  status="upcoming" />
              ))
              : history.map((item) => (
                <HistoryCard key={item._id} item={item} user={user} status={item._status} />
              ))
            }
          </div>
        )}

      </div>
      {cancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-8 w-[520px] shadow-xl">

            <h2 className="text-3xl font-semibold mb-3">
              Cancel Appointment
            </h2>

            <p className="text-gray-600 text-xl mb-6">
              Are you sure you want to cancel this appointment?
            </p>

            <div className="bg-gray-100 p-4 text-xl space-y-2.5 rounded-lg mb-6">
              <p className="font-medium">
                {selectedAppointment?.serviceId?.name}
              </p>

              <p className="text-md text-gray-500">
                {formatDate(selectedAppointment?.date)} • {formatTime(selectedAppointment?.startTime)}
              </p>

              <p className="text-md text-gray-500">
                Staff: {selectedAppointment?.staffId?.name}
              </p>
            </div>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setCancelModal(false)}
                className="px-4 py-2 text-xl bg-gray-200 rounded-lg"
              >
                Keep Booking
              </button>

              <button
                onClick={confirmCancel}
                disabled={cancelMutation.isPending}
                className="px-4 py-2 bg-red-500 text-xl text-white rounded-lg"
              >
                {cancelMutation.isPending ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};