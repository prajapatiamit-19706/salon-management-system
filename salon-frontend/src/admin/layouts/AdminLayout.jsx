import { Outlet } from "react-router-dom";
import { useState } from "react";
import { AdminSidebar } from "../components/AdminSidebar";
import { AdminNavbar } from "../components/AdminNavbar";

export const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-soft font-sans" style={{ fontSize: "16px" }}>
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Mobile overlay — dims background when sidebar is open */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-overlay-dark lg:hidden"
        />
      )}

      {/* Main content — no margin on mobile (sidebar hidden), offset on lg+ */}
      <div className="ml-0 lg:ml-[260px] transition-all duration-300 min-h-screen flex flex-col">
        <AdminNavbar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

        <main className="flex-1 p-4 lg:p-6 xl:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
