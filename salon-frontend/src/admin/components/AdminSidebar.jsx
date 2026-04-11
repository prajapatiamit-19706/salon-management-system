import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  CalendarCheck,
  Scissors,
  Users,
  UserCircle,
  CreditCard,
  Image,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  X,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Appointments", icon: CalendarCheck, path: "/admin/appointments" },
  { label: "Services", icon: Scissors, path: "/admin/services" },
  { label: "Staff", icon: Users, path: "/admin/staff" },
  { label: "Customers", icon: UserCircle, path: "/admin/customers" },
  { label: "Payments", icon: CreditCard, path: "/admin/payments" },
  { label: "Gallery", icon: Image, path: "/admin/gallery" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

export const AdminSidebar = ({ mobileOpen = false, onMobileClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    queryClient.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
  };

  const handleNavClick = () => {
    if (onMobileClose) onMobileClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out flex flex-col
          ${collapsed ? "lg:w-[78px]" : "lg:w-[260px]"}
          w-[260px]
          bg-bg-dark
          border-r border-border-soft/10 shadow-strong
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* ── Logo area ────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-6 border-b border-text-invert/10">
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""}`}>
            <div className="w-9 h-9 rounded-xl bg-primary-soft flex items-center justify-center shadow-lg">
              <Sparkles size={18} className="text-text-invert" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="text-[15px] font-bold text-text-invert tracking-wide leading-none">
                  GlowUp
                </h1>
                <p className="text-[10px] text-bg-soft font-medium tracking-widest uppercase mt-0.5">
                  Admin Panel
                </p>
              </div>
            )}
          </div>

          {/* Close button — mobile only */}
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg hover:bg-text-invert/10 text-text-muted hover:text-text-invert transition-colors lg:hidden"
          >
            <X size={18} />
          </button>

          {/* Collapse/expand toggle — desktop only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:block p-1.5 rounded-lg hover:bg-text-invert/10 text-text-muted hover:text-text-invert transition-colors
              ${collapsed ? "absolute -right-3 top-7 bg-bg-dark border border-border-soft/20 shadow-lg rounded-full p-1" : ""}
            `}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* ── Navigation ───────────────────────────── */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-hide">
          <div className="space-y-1">
            {!collapsed && (
              <p className="text-[10px] font-semibold  uppercase tracking-[0.15em] text-text-muted px-3 mb-3">
                Main Menu
              </p>
            )}
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200
                  ${collapsed ? "justify-center" : ""}
                  ${isActive
                    ? "bg-primary-soft/30 text-bg-soft! shadow-sm border border-bg-soft/15"
                    : "text-text-invert! hover:text-text-invert! hover:bg-text-invert/5"
                  }`
                }
              >
                <item.icon
                  size={19}
                  className="shrink-0 transition-transform duration-200 group-hover:scale-110"
                />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* ── Bottom section ───────────────────────── */}
        <div className="px-3 pb-5 border-t border-text-invert/10 pt-4">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium w-full
              text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
