import { useState, useContext } from "react";
import { Save, Store, Bell, Shield, Palette, Globe } from "lucide-react";
import { AuthContext } from "../../context/authContext";
import toast from "react-hot-toast";

const tabs = [
  { id: "general", label: "General", icon: Store },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
];

export const Settings = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("general");

  const [general, setGeneral] = useState({
    salonName: "GlowUp Salon",
    email: user?.email || "admin@glowup.com",
    phone: "+91 98765 43210",
    address: "123, MG Road, Bengaluru, Karnataka 560001",
    website: "www.glowupsalon.com",
    openTime: "09:00",
    closeTime: "21:00",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  });

  const [notifs, setNotifs] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newBookingAlert: true,
    cancellationAlert: true,
    paymentAlert: true,
    reviewAlert: false,
  });

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-xl font-bold text-text-heading tracking-tight">Settings</h1>
        <p className="text-[13px] text-text-body mt-0.5">Manage your salon preferences and configuration</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs sidebar */}
        <div className="lg:w-56 shrink-0">
          <div className="bg-bg-main rounded-2xl border border-border-soft p-2 shadow-soft">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? "bg-bg-panel text-primary shadow-sm border border-border-soft"
                    : "text-text-body hover:text-text-heading hover:bg-bg-soft"
                  }
                `}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-bg-main rounded-2xl border border-border-soft shadow-soft p-6">
          {activeTab === "general" && (
            <div className="space-y-5">
              <h2 className="text-[15px] font-semibold text-text-heading pb-3 border-b border-border-soft">
                General Settings
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Salon Name">
                  <input value={general.salonName} onChange={(e) => setGeneral({ ...general, salonName: e.target.value })} className="form-input" />
                </FormField>
                <FormField label="Email">
                  <input type="email" value={general.email} onChange={(e) => setGeneral({ ...general, email: e.target.value })} className="form-input" />
                </FormField>
                <FormField label="Phone">
                  <input value={general.phone} onChange={(e) => setGeneral({ ...general, phone: e.target.value })} className="form-input" />
                </FormField>
                <FormField label="Website">
                  <input value={general.website} onChange={(e) => setGeneral({ ...general, website: e.target.value })} className="form-input" />
                </FormField>
                <div className="sm:col-span-2">
                  <FormField label="Address">
                    <input value={general.address} onChange={(e) => setGeneral({ ...general, address: e.target.value })} className="form-input" />
                  </FormField>
                </div>
                <FormField label="Opening Time">
                  <input type="time" value={general.openTime} onChange={(e) => setGeneral({ ...general, openTime: e.target.value })} className="form-input" />
                </FormField>
                <FormField label="Closing Time">
                  <input type="time" value={general.closeTime} onChange={(e) => setGeneral({ ...general, closeTime: e.target.value })} className="form-input" />
                </FormField>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-5">
              <h2 className="text-[15px] font-semibold text-text-heading pb-3 border-b border-border-soft">
                Notification Preferences
              </h2>
              <div className="space-y-4">
                <ToggleRow
                  label="Email Notifications"
                  desc="Receive notifications via email"
                  value={notifs.emailNotifications}
                  onChange={(v) => setNotifs({ ...notifs, emailNotifications: v })}
                />
                <ToggleRow
                  label="SMS Notifications"
                  desc="Receive notifications via SMS"
                  value={notifs.smsNotifications}
                  onChange={(v) => setNotifs({ ...notifs, smsNotifications: v })}
                />
                <ToggleRow
                  label="New Booking Alerts"
                  desc="Get notified when a new appointment is booked"
                  value={notifs.newBookingAlert}
                  onChange={(v) => setNotifs({ ...notifs, newBookingAlert: v })}
                />
                <ToggleRow
                  label="Cancellation Alerts"
                  desc="Get notified when an appointment is cancelled"
                  value={notifs.cancellationAlert}
                  onChange={(v) => setNotifs({ ...notifs, cancellationAlert: v })}
                />
                <ToggleRow
                  label="Payment Alerts"
                  desc="Get notified on payment transactions"
                  value={notifs.paymentAlert}
                  onChange={(v) => setNotifs({ ...notifs, paymentAlert: v })}
                />
                <ToggleRow
                  label="Review Alerts"
                  desc="Get notified when customers leave reviews"
                  value={notifs.reviewAlert}
                  onChange={(v) => setNotifs({ ...notifs, reviewAlert: v })}
                />
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-5">
              <h2 className="text-[15px] font-semibold text-text-heading pb-3 border-b border-border-soft">
                Security Settings
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Current Password">
                  <input type="password" className="form-input" placeholder="Enter current password" />
                </FormField>
                <div />
                <FormField label="New Password">
                  <input type="password" className="form-input" placeholder="Enter new password" />
                </FormField>
                <FormField label="Confirm New Password">
                  <input type="password" className="form-input" placeholder="Confirm new password" />
                </FormField>
              </div>
              <div className="p-4 rounded-xl bg-bg-panel border border-border-soft mt-4">
                <p className="text-[12px] text-primary font-medium">🔒 Password must be at least 8 characters with one uppercase, lowercase, and number.</p>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-5">
              <h2 className="text-[15px] font-semibold text-text-heading pb-3 border-b border-border-soft">
                Appearance
              </h2>
              <div className="space-y-4">
                <FormField label="Theme">
                  <div className="flex items-center gap-3">
                    {["Light", "Dark", "System"].map((theme) => (
                      <button
                        key={theme}
                        className="px-4 py-2 rounded-xl text-[12px] font-medium bg-bg-soft border border-border-soft text-text-body hover:border-primary-soft hover:text-primary transition-colors first:bg-bg-panel first:border-primary-soft first:text-primary"
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </FormField>
                <FormField label="Accent Color">
                  <div className="flex items-center gap-2">
                    {["#0B3558", "#1F4E79", "#355E72", "#6B8A99", "#3B82F6", "#10B981"].map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-xl border-2 border-bg-main shadow-soft hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </FormField>
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="flex justify-end mt-6 pt-4 border-t border-border-soft">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-text-invert text-[13px] font-medium shadow-medium hover:bg-primary-soft transition-all duration-200"
            >
              <Save size={15} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormField = ({ label, children }) => (
  <div>
    <label className="block text-[11px] font-semibold text-text-body uppercase tracking-wide mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

const ToggleRow = ({ label, desc, value, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-bg-soft">
    <div>
      <p className="text-[13px] font-medium text-text-heading">{label}</p>
      <p className="text-[11px] text-text-muted mt-0.5">{desc}</p>
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200
        ${value ? "bg-primary" : "bg-border-soft"}
      `}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-bg-main shadow-sm transition-transform duration-200
          ${value ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </button>
  </div>
);
