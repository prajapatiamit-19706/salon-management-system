import { useState } from "react";
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  IndianRupee,
  TrendingUp,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminDashboardApi } from "../../API/dashboard.api";
import { LoadingSpinner } from "../../components/LoadingSpinner";

export const Dashboard = () => {


  const token = localStorage.getItem("token");

  const { data: dashboardData, isPending, error, refetch } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: () => fetchAdminDashboardApi(token),
    staleTime: 5 * 60 * 1000,
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const ampm = hours >= 12 ? "PM" : "AM";
    const h = hours % 12 || 12;
    return `${h}:${mins === 0 ? "00" : mins} ${ampm}`;
  };

  if (isPending) return <LoadingSpinner />
  if (error)
    return (
      <div className="p-4">
        <p>Error: {error?.message}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );

  const {
    stats: apiStats = {},
    monthlyRevenue: realMonthlyRevenue = [],
    staffPerformance: realStaffPerformance = [],
    recentAppointments = []
  } = dashboardData || {};

  const maxRevenue = Math.max(...realMonthlyRevenue.map((m) => m.revenue), 1000);

  const stats = [
    { title: "Total Appointments", value: (apiStats.totalAppointments || 0).toLocaleString(), icon: CalendarCheck, color: "blue", trend: "up", trendValue: "+12%" },
    { title: "Upcoming", value: (apiStats.upcoming || 0).toLocaleString(), icon: Clock, color: "amber", trend: "up", trendValue: "+8%" },
    { title: "Completed", value: (apiStats.completed || 0).toLocaleString(), icon: CheckCircle2, color: "green", trend: "up", trendValue: "+15%" },
    { title: "Cancelled", value: (apiStats.cancelled || 0).toLocaleString(), icon: XCircle, color: "red", trend: "down", trendValue: "-3%" },
    { title: "Total Customers", value: (apiStats.totalCustomers || 0).toLocaleString(), icon: Users, color: "purple", trend: "up", trendValue: "+18%" },
    { title: "Total Revenue", value: `₹${((apiStats.totalRevenue || 0) / 1000).toFixed(1)}K`, icon: IndianRupee, color: "cyan", trend: "up", trendValue: "+22%" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-text-heading tracking-tight">Dashboard</h1>
        <p className="text-[13px] text-text-body mt-0.5">Welcome back! Here's what's happening today.</p>
      </div>

      {/* ── Stat cards ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* ── Revenue chart + Staff Performance ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-bg-main rounded-2xl border border-border-soft p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[15px] font-semibold text-text-heading">Monthly Revenue</h2>
              <p className="text-[11px] text-text-muted mt-0.5">Revenue overview for the past 12 months</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp size={13} />
              <span className="text-[11px] font-semibold">+22% YoY</span>
            </div>
          </div>

          {/* Line chart */}
          <div className="relative h-48 w-full mt-8 mb-6">
            <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible z-0">
              <defs>
                <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="1" className="text-primary" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="1" className="text-primary-soft" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" className="text-primary" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-primary" />
                </linearGradient>
              </defs>

              {/* Area */}
              <path
                d={`M0,200 ${realMonthlyRevenue.map((m, i) => {
                  const x = (i / (Math.max(realMonthlyRevenue.length - 1, 1))) * 1000;
                  const y = 200 - (m.revenue / maxRevenue) * 160 - 20;
                  return `L${x},${y}`;
                }).join(" ")} L1000,200 Z`}
                fill="url(#areaGradient)"
              />

              {/* Path */}
              <path
                d={`${realMonthlyRevenue.map((m, i) => {
                  const x = (i / (Math.max(realMonthlyRevenue.length - 1, 1))) * 1000;
                  const y = 200 - (m.revenue / maxRevenue) * 160 - 20;
                  return `${i === 0 ? 'M' : 'L'}${x},${y}`;
                }).join(" ")}`}
                fill="none"
                stroke="url(#lineColor)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points */}
              {realMonthlyRevenue.map((m, i) => {
                const x = (i / (Math.max(realMonthlyRevenue.length - 1, 1))) * 1000;
                const y = 200 - (m.revenue / maxRevenue) * 160 - 20;
                return (
                 <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    className="fill-bg-main stroke-primary pointer-events-none"
                    strokeWidth="2.5"
                  />
                );
              })}
            </svg>

            {/* Hover zones and X-axis labels */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              {realMonthlyRevenue.map((m, i) => {
                const xPercentage = (i / (Math.max(realMonthlyRevenue.length - 1, 1))) * 100;
                const yPercentage = ((200 - (m.revenue / maxRevenue) * 160 - 20) / 200) * 100;
                return (
                  <div key={i} 
                       className="absolute top-0 bottom-0 flex flex-col items-center group pointer-events-auto cursor-pointer"
                       style={{ left: `${xPercentage}%`, width: '40px', transform: 'translateX(-50%)' }}>
                    
                    {/* Tooltip */}
                    <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20 flex justify-center -translate-y-2 group-hover:translate-y-0"
                         style={{ top: `calc(${yPercentage}% - 35px)` }}>
                      <span className="bg-bg-dark text-text-invert text-[11px] px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap shadow-lg">
                        ₹{(m.revenue / 1000).toFixed(1)}K
                      </span>
                    </div>
                    
                    {/* Vertical guideline */}
                    <div className="absolute top-0 bottom-0 w-px bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    {/* Hover point emphasis */}
                    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-3 h-3 rounded-full bg-primary/20"
                         style={{ top: `calc(${yPercentage}% - 6px)` }} />
                    
                    {/* X-axis label */}
                    <span className="absolute -bottom-6 text-[10px] text-text-muted font-medium whitespace-nowrap">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Staff Performance */}
        <div className="bg-bg-main rounded-2xl border border-border-soft p-6 shadow-soft">
          <h2 className="text-[15px] font-semibold text-text-heading mb-4">Top Staff Performance</h2>
          <div className="space-y-4">
            {realStaffPerformance.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg-soft transition-colors group"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-text-invert text-[12px] font-bold shadow-sm
                    ${i === 0
                      ? "bg-primary"
                      : i === 1
                        ? "bg-primary-soft"
                        : i === 2
                          ? "bg-primary/70"
                          : "bg-text-muted"
                    }
                  `}
                >
                  {s?.name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-text-heading truncate">{s?.name || "Unknown"}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-text-muted">{s.appointments} appts</span>
                    <span className="text-[10px] text-border-soft">·</span>
                    <span className="text-[10px] text-emerald-600 font-medium">₹{(s.revenue / 1000).toFixed(1)}K</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-primary-soft fill-primary-soft" />
                  <span className="text-[12px] font-semibold text-text-heading">{s.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Appointments ─────────────────── */}
      <div className="bg-bg-main rounded-2xl border border-border-soft shadow-soft overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft">
          <h2 className="text-[15px] font-semibold text-text-heading">Recent Appointments</h2>
          <a
            href="/admin/appointments"
            className="flex items-center gap-1 text-[12px] text-primary font-medium hover:text-primary-soft transition-colors"
          >
            View All <ArrowUpRight size={13} />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-soft/80">
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-body text-left">Customer</th>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-body text-left">Service</th>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-body text-left">Staff</th>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-body text-left">Date & Time</th>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-body text-left">Amount</th>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-body text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft/50">
              {recentAppointments.map((apt) => (
                <tr key={apt._id} className="hover:bg-bg-soft/60 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-bg-panel flex items-center justify-center text-[10px] font-bold text-primary">
                        {apt.userId?.name?.charAt(0) || "?"}
                      </div>
                      <span className="text-[13px] font-medium text-text-heading">{apt.userId?.name || "Unknown User"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-[13px] text-text-body">{apt.serviceId?.name || "Unknown Service"}</td>
                  <td className="px-6 py-3.5 text-[13px] text-text-body">{apt.staffId?.name || "Unknown Staff"}</td>
                  <td className="px-6 py-3.5">
                    <div>
                      <span className="text-[12px] text-text-heading font-medium">{formatDate(apt.date)}</span>
                      <span className="text-[11px] text-text-muted ml-2">
                        {minutesToTime(apt.startTime)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-[13px] font-medium text-text-heading">₹{apt.price}</td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={apt.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
