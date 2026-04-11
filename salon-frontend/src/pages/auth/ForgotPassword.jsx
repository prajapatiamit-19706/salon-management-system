import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { HiEyeOff, HiEye } from "react-icons/hi";
import { NavLink, useNavigate } from "react-router-dom";
import { forgotPasswordApi, resetPasswordApi } from "../../API/authApi";
import toast from "react-hot-toast";

export const ForgotPassword = () => {
  const [step, setStep] = useState("email"); // email -> otp -> newPassword
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();


  const forgotPassword = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: () => {
      toast.success("otp sent successfully");
      setStep("otp");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const resetPassword = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      toast.success("Password reset successfully!");
      navigate("/auth/login");
    },
    onError: (error) => {
      toast.error(error.message);
    }

  })

  const handleSendOtp = (e) => {
    e.preventDefault();
    // if (email) setStep("otp");
    forgotPassword.mutate({ email });
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp) setStep("newPassword");
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    resetPassword.mutate({ email, otp, newPassword });
  };

  return (
    <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center h-64 w-full flex items-center justify-center px-4 py-8">
      {/* Card */}
      <div className="container w-[400px] h-auto bg-bg rounded-3xl shadow-lg border border-border/70 px-8 py-10 md:px-10 md:py-12 relative overflow-hidden">

        {/* Brand / title */}
        <div className="relative mb-6 text-center">
          <p className="inline-flex items-center justify-center size-15 rounded-full bg-primary text-white text-3xl font-semibold shadow-md mb-2">
            GG
          </p>
          <h1 className="text-3xl font-semibold text-heading">Glow & Grace</h1>
          <p className="text-xl text-text mt-2">
            Recover your account
          </p>
        </div>

        {/* Title bar */}
        <div className="relative flex items-center bg-surface rounded-full p-1 mb-6 border border-border/70">
          <h1 className="flex-1 text-2xl font-medium py-2 rounded-full text-text-heading text-center">
            Forgot Password
          </h1>
        </div>

        {/* Forms container */}
        <div className="relative min-h-[220px]">

          {/* STEP 1: EMAIL FORM */}
          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-4 transition-all duration-500 opacity-100 translate-y-0">
              <p className="text-center text-xl text-text mb-4 mt-2">
                Enter your registered email and we'll send you an OTP to reset your password.
              </p>
              <div>
                <label className="block text-2xl pl-1 font-medium text-heading mb-1 mt-5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border/80 bg-bg px-4 py-3 text-2xl text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft mb-4"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 inline-flex items-center cursor-pointer justify-center rounded-xl bg-primary px-4 py-2.5 text-2xl font-medium text-white shadow-md hover:bg-primary-dark transition"
              >
                Send OTP
              </button>

              <div className="flex justify-center items-center mt-5">
                <NavLink to={"/auth/login"}>
                  <span className="text-primary text-xl font-medium hover:underline">
                    Back to Login
                  </span>
                </NavLink>
              </div>
            </form>
          )}

          {/* STEP 2: OTP FORM */}
          {step === "otp" && (
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-center">
                Enter OTP
              </h2>
              <p className="text-xl text-center text-gray-500">
                OTP sent to {email}
              </p>

              <input
                type="text"
                placeholder="Enter 6 digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-border/80 bg-bg p-3 rounded-xl text-center text-2xl outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft mt-4"
              />

              <button
                onClick={handleVerifyOtp}
                className="w-full bg-bg-dark text-white py-3 rounded-xl text-2xl mt-4 cursor-pointer hover:bg-black transition"
              >
                Verify OTP
              </button>

              <div className="flex justify-center items-center mt-6">
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-primary text-xl font-medium hover:underline cursor-pointer"
                >
                  Change Email
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: NEW PASSWORD FORM */}
          {step === "newPassword" && (
            <form onSubmit={handleResetPassword} className="space-y-4 transition-all duration-500 opacity-100 translate-y-0">
              <h2 className="text-3xl font-semibold text-center mb-4">
                Secure your account
              </h2>

              <div className="relative">
                <label className="block text-2xl pl-1 font-medium text-heading mb-1 mt-5">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  name="newPassword"
                  className="w-full rounded-xl border border-border/80 bg-bg px-4 py-3 text-2xl text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft mb-4 mt-2"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[50px] text-text text-2xl cursor-pointer hover:scale-110"
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>

              <div className="relative">
                <label className="block text-2xl pl-1 font-medium text-heading mb-1">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  name="confirmPassword"
                  className="w-full rounded-xl border border-border/80 bg-bg px-4 py-3 text-2xl text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft mb-2 mt-2"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-[50px] text-text text-2xl cursor-pointer hover:scale-110"
                >
                  {showConfirmPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>

              <button
                type="submit"
                disabled={resetPassword.isPending}
                className="w-full mt-6 inline-flex items-center cursor-pointer justify-center rounded-xl bg-primary px-4 py-2.5 text-2xl font-medium text-white shadow-md hover:bg-primary-dark transition"
              >
                {resetPassword.isPending ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
