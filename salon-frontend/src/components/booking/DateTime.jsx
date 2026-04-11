import { useQuery } from "@tanstack/react-query"
import { fetchAvailableSlots } from "../../API/appointment.api";
import { LoadingSpinner } from "../LoadingSpinner"

export const DateTime = ({
  selectedService,
  selectedStaff,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect
}) => {

  console.log("DateTime rendered");
  console.log("onDateSelect prop:", onDateSelect);
  const {
    data: slots = [],
    isPending,
    isError
  } = useQuery({
    queryKey: [
      "slots",
      selectedService?._id,
      selectedStaff?._id,
      selectedDate
    ],
    queryFn: () =>
      fetchAvailableSlots(
        selectedService?._id,
        selectedStaff?._id,
        selectedDate
      ),
    enabled:
      !!selectedService &&
      !!selectedStaff &&
      !!selectedDate
  })

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours % 12 || 12;
    return `${formattedHour}:${mins === 0 ? "00" : mins} ${ampm}`;
  };

  const generateNext7Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);

      days.push({
        full: date.toISOString().split("T")[0],
        day: date.toLocaleDateString("en-IN", { weekday: "short" }),
        dateNumber: date.getDate(),
        isToday: i === 0
      });
    }

    return days;
  };

  const next7Days = generateNext7Days();

  return (<div className="mt-10">
    <h2 className="text-2xl font-semibold mb-4">
      Select Date
    </h2>
    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
      {next7Days.map((d) => (
        <div
          key={d.full}
          onClick={() => onDateSelect(d.full)}
          className={`min-w-20 cursor-pointer rounded-xl p-3 text-center transition-all duration-200 
        ${selectedDate === d.full
              ? "bg-primary-soft text-white shadow-lg scale-105"
              : "bg-gray-100 hover:bg-gray-200"
            }`}
        >
          <p className="text-sm">{d.day}</p>
          <p className="text-xl font-bold">{d.dateNumber}</p>
          {d.isToday && (
            <span className="text-xs block mt-1 opacity-80">
              Today
            </span>
          )}
        </div>
      ))}
    </div>
    <h2 className="text-2xl font-semibold mt-8 mb-4">
      Select Time
    </h2>

    {isPending && !selectedDate ? <p className="text-xl text-gray-500"> Please Select date to load slots...</p> : null}


    {selectedService && selectedDate && !selectedStaff && <p className="text-gray-500 text-xl">Please select a staff member</p>}

    {slots.length === 0 && selectedService && selectedStaff && selectedDate && !isPending && (
      <p className="text-gray-500">
        No slots available for this date.
      </p>
    )}

    <div className="grid grid-cols-3 gap-3">
      {slots.map((slot) => (
        <button
          key={slot.startTime}
          onClick={() => onTimeSelect(slot.startTime)}
          className={`py-3 rounded-xl font-medium transition-all duration-200 
        ${selectedTime === slot.startTime
              ? "bg-primary-soft text-white shadow-md scale-105"
              : "bg-gray-100 hover:bg-gray-200"
            }`}
        >
          {formatTime(slot.startTime)}
        </button>
      ))}
    </div>


  </div>
  );
}