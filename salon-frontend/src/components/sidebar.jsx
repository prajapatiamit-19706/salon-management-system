import { useContext, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const Sidebar = ({ open, setOpen }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const modalRef = useRef(null);

  // ── Close dropdown on outside click ─────────────────────
  useEffect(() => {
    if (!open) return;
    const handleOutside = (e) => {
      // Ignore clicks inside the dropdown
      if (containerRef.current && containerRef.current.contains(e.target)) {
        return;
      }
      // Ignore clicks inside the modal
      if (modalRef.current && modalRef.current.contains(e.target)) {
        return;
      }
      setOpen(false);
      setShowLogoutConfirm(false);
    };
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleOutside);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [open]);

  // ── Close on Escape ──────────────────────────────────────
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (showLogoutConfirm) setShowLogoutConfirm(false);
        else setOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showLogoutConfirm]);

  // ── Handlers ─────────────────────────────────────────────
  const handleProfile = () => {
    navigate("/userDashboard");
    setOpen(false);
  };

  const confirmLogout = () => {
    queryClient.clear();
    logout();
    toast.success("Logged out successfully");
    setOpen(false);
    setShowLogoutConfirm(false);
    // Hard redirect to flush all React and Query state
    window.location.href = "/auth/login";
  };

  const menuItems = [
    {
      label: "My Dashboard",
      action: handleProfile,
      className: "text-text-body hover:text-text-heading hover:bg-bg-soft",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: "Logout",
      action: () => setShowLogoutConfirm(true), // ← opens confirm, not logout directly
      className: "text-red-500 hover:text-red-600 hover:bg-red-50",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
    },
  ];

  if (!open) return null;

  return (
    <>
      {/* ── Dropdown ── */}
      <div
        ref={containerRef}
        className="absolute right-0 top-full mt-2 w-60 z-50 bg-bg-main border border-border-soft rounded-2xl shadow-strong overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-border-soft bg-bg-soft">
          <p className="text-text-muted text-[10px] font-bold tracking-[3px] uppercase">
            Account
          </p>
        </div>

        {/* Menu items */}
        <div className="p-1.5 flex flex-col gap-0.5">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xl font-medium text-left transition-all duration-150 ${item.className}`}
            >
              <span className="shrink-0">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border-soft bg-bg-soft">
          <p className="text-text-muted text-[10px] text-center">
            Salon App · Client Portal
          </p>
        </div>
      </div>

      {/* ── Logout Confirmation Modal ── */}
      {showLogoutConfirm && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-overlay-dark backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />

          {/* Modal */}
          <div
            ref={modalRef}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 bg-bg-main border border-border-soft rounded-2xl shadow-strong overflow-hidden"
          >

            {/* Icon */}
            <div className="flex justify-center pt-15 pb-4">
              <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>

            {/* Text */}
            <div className="px-6 pb-5 text-center">
              <h3 className="text-text-heading font-bold text-2xl">
                Sign out?
              </h3>
              <p className="text-text-muted text-xl mt-1.5">
                Are you sure you want to log out of your account?
              </p>
            </div>

            {/* Actions */}
            <div className="px-5 pb-10 flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-border-soft text-text-body text-xl font-semibold hover:bg-bg-soft transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-2.5 rounded-xl cursor-pointer bg-red-500 hover:bg-red-600 text-white text-xl font-semibold transition-colors duration-150"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};