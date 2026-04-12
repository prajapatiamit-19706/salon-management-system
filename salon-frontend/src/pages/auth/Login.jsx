
import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { HiEyeOff } from "react-icons/hi";
import { HiEye } from "react-icons/hi";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext"
import { sendLoginOtpApi, verifyLoginOtpApi } from "../../API/authApi";
import toast from "react-hot-toast";

export const Login = () => {

  const { login } = useContext(AuthContext);
  const [showLoginPassword, setShowLoginPassword] = useState(true);
  const [step, setStep] = useState("form");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const sendLoginOtp = useMutation({
    mutationFn: sendLoginOtpApi,

    onSuccess: (_, variables) => {
      toast.success("otp sent successfully")
      setEmail(variables.email);
      setErrors({});
      setStep("otp");
      setTimer(60);
    },

    onError: (error) => {
      console.log("error", error);

      const msg = error.message || (typeof error === 'string' ? error : "Failed to send OTP");
      if (msg === "Invalid password or email") {
        setErrors({ password: msg });
      } else if (msg === "User not found or not verified") {
        setErrors({ email: msg });
      } else {
        setErrors({ server: msg });
      }
    }
  });

  const verifyLoginOtp = useMutation({
    mutationFn: verifyLoginOtpApi,

    onSuccess: (res) => {
      login(res.user, res.token);
      navigate("/");   // redirect after login
    },

    onError: (error) => {
      console.log("error", error);

      setErrors({
        otp: error.message || "Invalid OTP"
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    setErrors({});
    sendLoginOtp.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center h-64 w-full flex items-center justify-center px-4 py-8">
      {/* Card */}
      <div className="container w-[400px] h-auto bg-bg rounded-3xl shadow-lg border border-border/70 px-8 py-10 md:px-10 md:py-12
        relative overflow-hidden">

        {/* Brand / title */}
        <div className="relative mb-6 text-center">
          <p className="inline-flex items-center justify-center size-15 rounded-full bg-primary text-white text-3xl font-semibold shadow-md mb-2">
            GG
          </p>
          <h1 className="text-3xl font-semibold text-heading">Glow & Grace</h1>
          <p className="text-xl text-text mt-2">
            Welcome back, beauty!
          </p>
        </div>

        {/* Toggle tabs */}
        <div className="relative flex items-center bg-surface rounded-full p-1 mb-6 border border-border/70">

          <h1 className="flex-1 text-2xl font-medium py-2 rounded-full text-text-heading text-center"> Login</h1>

        </div>

        {/* Forms container */}
        <div className="relative min-h-[220px]">
          {/* LOGIN FORM */}
          {step === "form" && (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 transition-all duration-500 opacity-100 translate-y-0"
            >
              <div>
                <label className="block text-2xl pl-1 font-medium text-heading mb-1 mt-5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  className="w-full rounded-xl border border-border/80 bg-bg px-4 py-3 text-2xl text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft mb-1"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xl mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-2xl pl-1 font-medium text-heading mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? "password" : "text"}
                    required
                    name="password"
                    className="w-full rounded-xl border border-border/80 bg-bg px-4 py-3 pr-12 text-2xl text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text text-2xl cursor-pointer hover:scale-110"
                  >
                    {showLoginPassword ? <HiEyeOff /> : <HiEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xl mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-2xl mt-8 mb-6">

                <button
                  type="button"
                  className="text-primary hover:underline"
                >
                  <NavLink to={"/auth/forgot-password"}>
                    <span className="text-primary text-2xl font-medium hover:underline"> forgot password? </span>
                  </NavLink>
                </button>
              </div>

              {errors.server && (
                <p className="text-red-500 text-xl mt-2">
                  {errors.server}
                </p>
              )}


              <button
                type="submit"
                disabled={sendLoginOtp.isPending}
                className="w-full mt-2 inline-flex items-center cursor-pointer justify-center rounded-xl bg-primary px-4 py-2.5 text-2xl font-medium text-white shadow-md hover:bg-primary-dark transition"
              >
                {sendLoginOtp.isPending ? "Sending OTP..." : "Send OTP"}
              </button>
              <div className="flex justify-center items-center gap-2 mt-5">
                <p className=" text-center text-2xl text-text">
                  New here?{" "} </p>
                <NavLink to={"/auth/register"}>
                  <span className="text-primary text-2xl font-medium hover:underline"> Create an account </span>
                </NavLink>
              </div>
            </form>
          )}

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
                className="w-full border p-3 rounded-lg text-center text-2xl"
              />
              {errors.otp && (
                <p className="text-red-500 text-xl mt-1">
                  {errors.otp}
                </p>
              )}

              <button
                onClick={() => verifyLoginOtp.mutate({ email, otp })}
                disabled={verifyLoginOtp.isPending}
                className="w-full bg-bg-dark text-white py-3 rounded-lg text-2xl mt-2 cursor-pointer"
              >
                {verifyLoginOtp.isPending ? "Verifying..." : "Verify OTP"}
              </button>

              {/* Resend Section */}
              {timer > 0 ? (
                <p className="text-center text-gray-500 text-xl">
                  Resend OTP in {timer}s
                </p>
              ) : (
                <button
                  onClick={() => {
                    sendLoginOtp.mutate({ email });
                    setTimer(60);
                  }}
                  className="text-blue-600 w-full text-xl cursor-pointer"
                >
                  Resend OTP
                </button>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
