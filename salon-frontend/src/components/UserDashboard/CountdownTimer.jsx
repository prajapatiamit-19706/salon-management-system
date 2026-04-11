import { useEffect, useState } from "react";

export const CountdownTimer = ({ date, startTime }) => {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {

      const appointmentDate = new Date(date);
      appointmentDate.setHours(0, startTime, 0);

      const diff = appointmentDate - new Date();

      if (diff <= 0) {
        setRemaining("Started");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setRemaining(`${hours}h ${minutes}m remaining`);
    }, 60000);

    return () => clearInterval(interval);

  }, [date, startTime]);

  return (
    <p className="text-green-600 font-semibold mt-3">
      {remaining}
    </p>
  );
};