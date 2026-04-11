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
import { minutesToTime } from "../data/mockData";
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

          {/* Bar chart */}
          <div className="flex items-end justify-between gap-2 h-48">
            {realMonthlyRevenue.map((m, i) => {
              const height = (m.revenue / maxRevenue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full flex justify-center">
                    {/* Tooltip */}
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <span className="bg-bg-dark text-text-invert text-[10px] px-2 py-1 rounded-md font-medium whitespace-nowrap">
                        ₹{(m.revenue / 1000).toFixed(1)}K
                      </span>
                    </div>
                    <div
                      className="w-full max-w-8 rounded-t-lg bg-linear-to-t from-primary to-primary-soft group-hover:from-primary-soft group-hover:to-primary transition-all duration-300 cursor-pointer"
                      style={{ height: `${height}%`, minHeight: "8px" }}
                    />
                  </div>
                  <span className="text-[10px] text-text-muted font-medium">{m.month}</span>
                </div>
              );
            })}
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
                  {s.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-text-heading truncate">{s.name}</p>
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
                        {apt.userId.name.charAt(0)}
                      </div>
                      <span className="text-[13px] font-medium text-text-heading">{apt.userId.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-[13px] text-text-body">{apt.serviceId.name}</td>
                  <td className="px-6 py-3.5 text-[13px] text-text-body">{apt.staffId.name}</td>
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
