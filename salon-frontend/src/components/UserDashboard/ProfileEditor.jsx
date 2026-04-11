import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchUserDashboard, updateProfileApi } from "../../API/dashboard.api";
import { User, Mail, Phone, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { LoadingSpinner } from "../LoadingSpinner";

export const ProfileEditor = () => {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const { data, isPending, isError } = useQuery({
    queryKey: ["userDashboard"],
    queryFn: () => fetchUserDashboard(token),
  });

  const updateMutation = useMutation({
    mutationFn: () => updateProfileApi(token, form),
    onSuccess: () => {
      queryClient.invalidateQueries(["userDashboard"]);
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      console.log("error occur during updating profile", error);
      toast.error("Failed to update profile");
    }
  })

  useEffect(() => {
    if (data?.user) {
      setForm({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || ""
      });
    }
  }, [data]);

  const handleUpdate = () => {
    updateMutation.mutate(form);
  }

  if (isPending) return <LoadingSpinner />;

  if (isError) return (
    <div className="flex flex-col items-center justify-center p-12 bg-bg-main rounded-[24px] border border-border-soft shadow-soft max-w-lg mx-auto min-h-[400px]">
      <p className="text-red-500 font-medium">Failed to load profile.</p>
    </div>
  );

  const icons = {
    name: <User className="w-5 h-5 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />,
    email: <Mail className="w-5 h-5 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />,
    phone: <Phone className="w-5 h-5 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
  };

  return (
    <div className="bg-bg-main p-8 md:p-10 rounded-[32px] shadow-medium border border-border-soft max-w-xl mx-auto w-full transition-all duration-300 hover:shadow-strong">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border-soft">
        <div className="w-14 h-14 rounded-2xl bg-bg-panel border border-border-soft flex items-center justify-center text-primary shrink-0 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <User className="w-7 h-7 relative z-10" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-heading">
            My <span className="text-primary italic font-light">Profile</span>
          </h2>
          <p className="text-text-muted text-[13px] font-medium mt-1">
            Update your personal information below
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {["name", "email", "phone"].map((field) => (
          <div key={field} className="relative group">
            <label className="block text-[11px] font-bold tracking-[2px] uppercase text-text-muted mb-2 ml-1">
              {field}
            </label>
            <div className="relative">
              {icons[field]}
              <input
                type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                placeholder={`Enter your ${field}`}
                value={form[field]}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
                className="w-full pl-12 pr-4 py-4 bg-bg-soft border-2 border-transparent focus:border-primary/30 rounded-2xl text-text-body font-medium transition-all duration-300 outline-none hover:bg-bg-panel focus:bg-white focus:shadow-[0_0_0_4px_rgba(11,53,88,0.05)] placeholder:text-text-muted/60"
              />
            </div>
          </div>
        ))}

        <div className="pt-6 mt-6 border-t border-border-soft">
          <button
            className={`w-full relative overflow-hidden group flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-base font-bold tracking-wide transition-all duration-300 shadow-[0_4px_16px_rgba(11,53,88,0.15)]
              ${updateMutation.isPending
                ? "bg-primary-soft text-white opacity-90 cursor-wait"
                : "bg-primary text-white hover:bg-navy hover:shadow-[0_8px_24px_rgba(11,53,88,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_8px_rgba(11,53,88,0.15)]"
              }`}
            onClick={handleUpdate}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span>Save Profile Changes</span>
              </>
            )}

            {/* Shimmer effect */}
            {!updateMutation.isPending && (
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};