import { useState, useEffect } from "react";

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menu = [
    { id: "overview",      label: "Overview",          icon: "⊞" },
    { id: "appointments",  label: "Appointments",       icon: "🗓" },
    { id: "profile",       label: "Profile Settings",   icon: "⚙" },
  ];

  // Close drawer when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [activeTab]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const NavItems = () => (
    <nav className="flex flex-col gap-1.5 mt-2">
      {menu.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left text-base font-semibold transition-all duration-200 group
              ${isActive
                ? "bg-bg-dark text-text-invert shadow-medium"
                : "text-text-body hover:bg-bg-panel hover:text-text-heading"
              }`}
          >
            {/* Active left indicator */}
            <span className={`shrink-0 text-lg transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
              {item.icon}
            </span>
            <span className="flex-1">{item.label}</span>
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-text-invert/60 shrink-0" />
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* ════════════════════════════════════════
          DESKTOP — always visible, fixed left
          ════════════════════════════════════════ */}
      <aside className="hidden lg:flex flex-col lg:sticky lg:top-24 h-screen w-80 bg-bg-main border-r border-border-soft shadow-soft z-40">

        {/* Brand */}
        <div className="px-6 pt-8 pb-6 border-b border-border-soft">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-bg-dark flex items-center justify-center text-text-invert font-bold text-base shrink-0">
              S
            </div>
            <div>
              <p className="text-text-heading font-bold text-base leading-tight">Salon App</p>
              <p className="text-text-muted text-xs">Client Portal</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 px-4 py-5 overflow-y-auto">
          <p className="text-text-muted text-[10px] font-bold tracking-[3px] uppercase px-2 mb-3">
            Menu
          </p>
          <NavItems />
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-border-soft">
          <p className="text-text-muted text-xs text-center">© 2026 Salon App</p>
        </div>
      </aside>

      {/* ════════════════════════════════════════
          MOBILE — hamburger button (top-left)
          ════════════════════════════════════════ */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden sticky top-30 left-1 cursor-pointer z-50 w-12 h-12 bg-bg-dark text-text-invert rounded-xl flex items-center justify-center shadow-medium"
        aria-label="Open menu"
      >
        {/* Hamburger icon */}
        <span className="flex flex-col gap-1.5">
          <span className="block w-10 h-0.5 bg-text-invert rounded-full" />
          <span className="block w-7 h-0.5 bg-text-invert rounded-full" />
          <span className="block w-10 h-0.5 bg-text-invert rounded-full" />
           <span className="block w-7 h-0.5 bg-text-invert rounded-full" />
        </span>
      </button>

      {/* ════════════════════════════════════════
          MOBILE — backdrop overlay
          ════════════════════════════════════════ */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-overlay-dark backdrop-blur-sm"
        />
      )}

      {/* ════════════════════════════════════════
          MOBILE — slide-in drawer
          ════════════════════════════════════════ */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-screen w-72 bg-bg-main border-r border-border-soft shadow-strong z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Drawer header */}
        <div className="px-6 pt-6 pb-5 border-b border-border-soft flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-bg-dark flex items-center justify-center text-text-invert font-bold text-base shrink-0">
              S
            </div>
            <div>
              <p className="text-text-heading font-bold text-base leading-tight">Salon App</p>
              <p className="text-text-muted text-xs">Client Portal</p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="w-9 h-9 rounded-xl bg-bg-soft hover:bg-bg-panel border border-border-soft flex items-center justify-center text-text-muted hover:text-text-heading transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer menu */}
        <div className="flex-1 px-4 py-5 overflow-y-auto">
          <p className="text-text-muted text-[10px] font-bold tracking-[3px] uppercase px-2 mb-3">
            Menu
          </p>
          <NavItems />
        </div>

        {/* Drawer footer */}
        <div className="px-6 py-5 border-t border-border-soft">
          <p className="text-text-muted text-xs text-center">© 2026 Salon App</p>
        </div>
      </aside>
    </>
  );
};