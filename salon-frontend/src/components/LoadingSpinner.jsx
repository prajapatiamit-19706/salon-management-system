export const LoadingSpinner = ({ fullScreen = true, message = "Loading..." }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-8 bg-bg-soft
        ${fullScreen ? "fixed inset-0 z-50" : "w-full py-24"}`}
    >
      {/* ── Spinner rings ── */}
      <div className="relative w-20 h-20 flex items-center justify-center">

        {/* Outer slow ring */}
        <div className="absolute inset-0 rounded-full border-2 border-border-soft" />

        {/* Spinning arc — large */}
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"
          style={{ animationDuration: "1.2s" }}
        />

        {/* Spinning arc — medium, opposite */}
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent border-b-primary-soft animate-spin"
          style={{ animationDuration: "0.9s", animationDirection: "reverse" }}
        />

        {/* Spinning arc — small */}
        <div
          className="absolute inset-4 rounded-full border-2 border-transparent border-t-primary/40 animate-spin"
          style={{ animationDuration: "0.6s" }}
        />

        {/* Center dot */}
        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
      </div>

      {/* ── Brand + message ── */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-text-heading font-bold text-base tracking-wide">
          Salon App
        </p>
        <div className="flex items-center gap-1.5">
          {/* Animated dots */}
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }}
            />
          ))}
        </div>
        <p className="text-text-muted text-xs tracking-[3px] uppercase font-mono">
          {message}
        </p>
      </div>
    </div>
  );
};