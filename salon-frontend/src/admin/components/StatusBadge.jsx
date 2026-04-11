export const StatusBadge = ({ status }) => {
  const styles = {
    booked:    "bg-bg-panel text-primary border-border-soft",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    cancelled: "bg-red-50 text-red-600 border-red-200/60",
    pending:   "bg-bg-soft text-primary-soft border-border-soft",
    refunded:  "bg-bg-soft text-text-body border-border-soft",
    active:    "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    inactive:  "bg-bg-soft text-text-muted border-border-soft",
  };

  const dotColors = {
    booked:    "bg-primary",
    completed: "bg-emerald-500",
    cancelled: "bg-red-500",
    pending:   "bg-primary-soft",
    refunded:  "bg-text-muted",
    active:    "bg-emerald-500",
    inactive:  "bg-text-muted",
  };

  const s = status?.toLowerCase() || "pending";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border capitalize
        ${styles[s] || styles.pending}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[s] || dotColors.pending}`} />
      {status}
    </span>
  );
};
