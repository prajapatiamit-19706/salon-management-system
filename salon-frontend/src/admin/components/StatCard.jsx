import { TrendingUp, TrendingDown } from "lucide-react";

export const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "primary" }) => {
  const colorMap = {
    primary: { bg: "bg-bg-panel", iconBg: "bg-primary", text: "text-primary", ring: "ring-primary/10" },
    blue: { bg: "bg-bg-panel", iconBg: "bg-primary-soft", text: "text-primary-soft", ring: "ring-primary-soft/10" },
    green: { bg: "bg-emerald-50", iconBg: "bg-gradient-to-br from-emerald-400 to-teal-500", text: "text-emerald-600", ring: "ring-emerald-500/10" },
    red: { bg: "bg-red-50", iconBg: "bg-gradient-to-br from-red-400 to-rose-500", text: "text-red-600", ring: "ring-red-500/10" },
    amber: { bg: "bg-bg-panel", iconBg: "bg-primary", text: "text-primary", ring: "ring-primary/10" },
    purple: { bg: "bg-purple-50", iconBg: "bg-gradient-to-br from-purple-400 to-violet-500", text: "text-purple-600", ring: "ring-purple-500/10" },
    cyan: { bg: "bg-bg-soft", iconBg: "bg-primary-soft", text: "text-primary-soft", ring: "ring-primary-soft/10" },
  };

  const c = colorMap[color] || colorMap.primary;
  const isUp = trend === "up";

  return (
    <div
      className={`relative group bg-bg-main rounded-2xl border border-border-soft p-5 hover:shadow-medium transition-all duration-300 hover:-translate-y-0.5 overflow-hidden`}
    >
      {/* Subtle gradient overlay on hover */}
      <div className={`absolute inset-0 ${c.bg} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-2xl`} />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
            {title}
          </p>
          <p className="text-2xl font-bold text-text-heading tracking-tight">{value}</p>
          {trendValue && (
            <div className="flex items-center gap-1.5">
              {isUp ? (
                <TrendingUp size={13} className="text-emerald-500" />
              ) : (
                <TrendingDown size={13} className="text-red-500" />
              )}
              <span
                className={`text-[11px] font-semibold ${isUp ? "text-emerald-600" : "text-red-600"
                  }`}
              >
                {trendValue}
              </span>
              <span className="text-[10px] text-text-muted">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={`w-11 h-11 rounded-xl ${c.iconBg} flex items-center justify-center shadow-lg ring-4 ${c.ring} shrink-0`}
        >
          <Icon size={20} className="text-text-invert" />
        </div>
      </div>
    </div>
  );
};
