import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const StatCard = ({ label, value, icon, accent }) => {
  const count = useCountUp(value);
  return (
    <div className="relative bg-bg-main border border-border-soft rounded-2xl px-6 py-6 flex flex-col gap-4 shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden group">
      <div className={`absolute top-0 left-0 right-0 h-1 ${accent} opacity-60 group-hover:opacity-100 transition-opacity rounded-t-2xl`} />
      <div className="flex items-center justify-between">
        <span className="text-text-muted text-sm font-bold tracking-widest uppercase">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-text-heading text-5xl font-bold tabular-nums leading-none">{count}</p>
    </div>
  );
};
const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHour = hours % 12 || 12;
  return `${formattedHour}:${mins === 0 ? "00" : mins} ${ampm}`;
};

export const Overview = ({
  user,
  stats = {},
  favoriteStaff,
  upcomingAppointments = [],
}) => {
  const nextAppointment = upcomingAppointments?.[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const statCards = [
    { label: "Total", value: stats.total ?? 0, icon: "📋", accent: "bg-primary" },
    { label: "Upcoming", value: stats.upcoming ?? 0, icon: "🗓️", accent: "bg-primary-soft" },
    { label: "Completed", value: stats.completed ?? 0, icon: "✅", accent: "bg-emerald-500" },
    { label: "Cancelled", value: stats.cancelled ?? 0, icon: "✕", accent: "bg-red-400" },
  ];

  return (
    <div className="min-h-screen w-full bg-bg-soft p-6 lg:p-10">
      <div className="w-full max-w-7xl mx-auto space-y-8">

        {/* ── Welcome Banner ── */}
        <div className="relative bg-bg-dark rounded-3xl px-8 py-8 lg:px-12 lg:py-10 overflow-hidden shadow-strong">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-text-invert/5" />
          <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full border border-text-invert/5" />
          <div className="absolute bottom-0 left-1/3 w-80 h-px bg-linear-to-r from-transparent via-text-invert/10 to-transparent" />

          <div className="relative flex items-center justify-between gap-6">
            <div className="space-y-3">
              <p className="text-text-invert/50 text-sm tracking-[4px] uppercase font-mono">
                {greeting}
              </p>
              <h1 className="text-text-invert text-4xl lg:text-5xl font-bold capitalize leading-tight">
                {user?.name ?? "Guest"} 👋
              </h1>
              <p className="text-text-invert/50 text-base lg:text-lg">{user?.email}</p>
              <div className="flex flex-wrap gap-3 pt-1">
                {user?.phone && (
                  <span className="inline-flex items-center gap-2 bg-text-invert/8 border border-text-invert/10 text-text-invert/70 text-sm px-4 py-1.5 rounded-full">
                    📞 {user.phone}
                  </span>
                )}
                {user?.gender && (
                  <span className="inline-flex items-center gap-2 bg-text-invert/8 border border-text-invert/10 text-text-invert/70 text-sm px-4 py-1.5 rounded-full">
                    {user.gender === "Female" ? "♀" : "♂"} {user.gender}
                  </span>
                )}
              </div>
            </div>
            <div>
              {
                user?.role === "admin" ? <NavLink to={"/admin"}> <span className="text-white underline hover:text-blue-400"> Admin Panel </span></NavLink> : null
              }
            </div>

            <div className="shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-bg-soft/10 border border-text-invert/10 flex items-center justify-center text-4xl lg:text-5xl shadow-inset">
              {user?.gender === "Female" ? "👩" : "👤"}
            </div>
          </div>

        </div>

        {/* ── Stats Grid ── */}
        <div>
          <p className="text-text-muted text-sm font-bold tracking-[3px] uppercase mb-4">
            Your Statistics
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>

        {/* ── Next Appointment + Fav Staff ── */}
        <div className="grid lg:grid-cols-2 gap-5">

          {/* Next Appointment */}
          <div className="bg-bg-main border border-border-soft rounded-2xl p-7 shadow-soft hover:shadow-medium transition-all duration-300">
            <p className="text-text-muted text-sm font-bold tracking-[3px] uppercase mb-5">
              Next Appointment
            </p>

            {nextAppointment ? (
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-bg-panel border border-border-soft flex items-center justify-center text-2xl shrink-0">
                    💇
                  </div>
                  <div className="min-w-0">
                    <p className="text-text-heading font-bold text-lg truncate">
                      {nextAppointment.serviceId?.name ?? "Service"}
                    </p>
                    <p className="text-text-muted text-base mt-0.5">
                      with <span className="text-text-body font-semibold">{nextAppointment.staffId?.name ?? "—"}</span>
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border-soft" />

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📅</span>
                    <span className="font-mono text-sm text-text-body">{nextAppointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">🕐</span>
                    <span className="font-mono text-sm text-text-body">{formatTime(nextAppointment.startTime)}</span>
                  </div>
                  <span className="text-primary font-bold text-xl">
                    ₹{nextAppointment.price}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 bg-bg-panel border border-border-soft px-4 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-primary text-xs font-bold tracking-[3px] uppercase">Upcoming</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <span className="text-5xl text-border-soft">🗓️</span>
                <p className="text-text-muted text-base text-center">No upcoming appointments</p>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            {/* Favourite Staff */}
            <div className="bg-bg-main border border-border-soft rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 flex items-center gap-5 flex-1">
              <div className="w-16 h-16 rounded-full bg-bg-panel border border-border-soft flex items-center justify-center text-3xl shrink-0">
                ⭐
              </div>
              <div className="min-w-0">
                <p className="text-text-muted text-sm font-bold tracking-[3px] uppercase mb-1">
                  Favourite Staff
                </p>
                <p className="text-text-heading font-bold text-xl truncate">
                  {favoriteStaff ?? "—"}
                </p>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="bg-bg-panel border border-border-soft rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 flex items-center gap-5 flex-1">
              <div className="w-16 h-16 rounded-full bg-bg-main border border-border-soft flex items-center justify-center text-3xl shrink-0">
                🏆
              </div>
              <div>
                <p className="text-text-muted text-sm font-bold tracking-[3px] uppercase mb-1">
                  Completion Rate
                </p>
                <p className="text-text-heading font-bold text-xl">
                  {stats.total
                    ? `${Math.round((stats.completed / stats.total) * 100)}%`
                    : "0%"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Coming Up ── */}
        {upcomingAppointments.length > 1 && (
          <div>
            <p className="text-text-muted text-sm font-bold tracking-[3px] uppercase mb-4">
              Coming Up ({upcomingAppointments.length})
            </p>
            <div className="bg-bg-main border border-border-soft rounded-2xl overflow-hidden shadow-soft divide-y divide-border-soft">
              {upcomingAppointments.slice(1, 5).map((apt, i) => (
                <div
                  key={apt._id ?? i}
                  className="flex items-center gap-5 px-7 py-5 hover:bg-bg-soft transition-colors group"
                >
                  <span className="font-mono text-base text-text-muted/50 w-6 shrink-0">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-bg-panel border border-border-soft flex items-center justify-center text-lg shrink-0">
                    💇
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-heading font-semibold text-base truncate">
                      {apt.serviceId?.name ?? "Service"}
                    </p>
                    <p className="text-text-muted text-sm">
                      {apt.staffId?.name} · {apt.date}
                    </p>
                  </div>
                  <span className="text-primary font-bold text-lg shrink-0">
                    ₹{apt.price}
                  </span>
                </div>
              ))}

              {upcomingAppointments.length > 5 && (
                <div className="px-7 py-4 text-center bg-bg-soft">
                  <span className="text-text-muted text-sm font-mono tracking-wide">
                    +{upcomingAppointments.length - 5} more appointments
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};