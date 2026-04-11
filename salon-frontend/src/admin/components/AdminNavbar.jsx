import { useState, useRef, useEffect, useContext } from "react";
import { Bell, Search, ChevronDown, LogOut, User, Settings, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

export const AdminNavbar = ({ onMobileMenuToggle }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const notifications = [
    { id: 1, text: "New appointment booked by Rahul Sharma", time: "2 min ago", unread: true },
    { id: 2, text: "Payment received: ₹5,000 for Bridal Makeup", time: "15 min ago", unread: true },
    { id: 3, text: "Appointment cancelled by Karan Mehta", time: "1 hr ago", unread: false },
    { id: 4, text: "New review: 5★ from Ananya Iyer", time: "3 hrs ago", unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 bg-bg-main/80 backdrop-blur-xl border-b border-border-soft px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left side — Mobile menu + Search */}
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-xl hover:bg-bg-soft text-text-body"
          >
            <Menu size={20} />
          </button>

          <div className="hidden sm:flex items-center flex-1 max-w-md relative">
            <Search size={16} className="absolute left-3 text-text-muted" />
            <input
              type="text"
              placeholder="Search appointments, services, staff…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-soft border border-border-soft text-[13px] text-text-heading
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-soft focus:bg-bg-main
                placeholder:text-text-muted transition-all duration-200"
            />
          </div>
        </div>

        {/* Right side — Notifications + Profile */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative p-2.5 rounded-xl hover:bg-bg-soft text-text-body hover:text-text-heading transition-colors"
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-red-500 text-text-invert text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-bg-main">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-bg-main rounded-2xl shadow-medium border border-border-soft overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-border-soft flex items-center justify-between">
                  <h3 className="text-[13px] font-semibold text-text-heading">Notifications</h3>
                  <span className="text-[11px] text-primary bg-bg-panel px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} new
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 border-b border-bg-soft hover:bg-bg-soft cursor-pointer transition-colors
                        ${n.unread ? "bg-bg-panel/30" : ""}
                      `}
                    >
                      <p className="text-[12px] text-text-body leading-relaxed">{n.text}</p>
                      <p className="text-[10px] text-text-muted mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 text-center border-t border-border-soft">
                  <button className="text-[12px] text-primary font-medium hover:text-primary-soft">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-border-soft mx-1 hidden sm:block" />

          {/* Profile dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-bg-soft transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-text-invert text-[12px] font-bold shadow-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[12px] font-semibold text-text-heading leading-none">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[10px] text-text-muted mt-0.5">Administrator</p>
              </div>
              <ChevronDown size={14} className="text-text-muted hidden sm:block" />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-bg-main rounded-2xl shadow-medium border border-border-soft overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-border-soft">
                  <p className="text-[12px] font-semibold text-text-heading">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-[11px] text-text-muted">{user?.email || "admin@salon.com"}</p>
                </div>
                <div className="py-1.5">
                  <button
                    onClick={() => {
                      navigate("/admin/settings");
                      setShowProfile(false);
                    }}
                    className="flex items-center gap-2.5 px-4 py-2 w-full text-[12px] text-text-body hover:bg-bg-soft hover:text-text-heading transition-colors"
                  >
                    <User size={14} />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/admin/settings");
                      setShowProfile(false);
                    }}
                    className="flex items-center gap-2.5 px-4 py-2 w-full text-[12px] text-text-body hover:bg-bg-soft hover:text-text-heading transition-colors"
                  >
                    <Settings size={14} />
                    Settings
                  </button>
                </div>
                <div className="border-t border-border-soft py-1.5">
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      navigate("/");
                    }}
                    className="flex items-center gap-2.5 px-4 py-2 w-full text-[12px] text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
