import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect, useRef, useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { NavLink, useNavigate } from "react-router-dom";
import { sendRegisterOtpApi, verifyRegisterOtpApi } from "../../API/authApi";
import { AuthContext } from "../../context/authContext";
import toast from "react-hot-toast";

export const Register = () => {

  const { login } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [errors, setErrors] = useState({});
  // Step control
  const [step, setStep] = useState("form"); // form | otp
  // OTP
  const [otp, setOtp] = useState("");
  // Timer
  const [timer, setTimer] = useState(60);
  const [email, setEmail] = useState("");

  const formRef = useRef(null);
  const navigate = useNavigate();

  // ================= SEND OTP =================
  const sendOtp = useMutation({
    mutationFn: sendRegisterOtpApi,
    onSuccess: (_, variables) => {
      setEmail(variables.email); // store only email
      setErrors({});
      formRef.current.reset();    //reset form 
      toast.success("otp sent successful!");

      setStep("otp");
      setTimer(60);
    },
    onError: (error) => {
      setErrors({
        server: error.message || "Something went wrong"
      });
    }
  });

  // ================= VERIFY OTP =================
  const verifyOtp = useMutation({
    mutationFn: verifyRegisterOtpApi,

    onSuccess: (res) => {
      login(res.user, res.token);
      navigate("/");
    },
    onError: (error) => {
      setErrors({
        otp: error.message || "Invalid OTP"
      });
    }
  });

  // ================= TIMER =================
  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [step, timer]);



  const validateRegisterForm = (data) => {
    const newErrors = {};

    if (!data.name || data.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      newErrors.email = "Enter a valid email address";
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(data.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!data.gender) {
      newErrors.gender = "Please select gender";
    }

    if (!data.password || data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const validationErrors = validateRegisterForm(data);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    sendOtp.mutate(data); // call API
  };




  return <>
    <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center h-64 w-full flex items-center justify-center px-4 py-8">

      <div className="container w-[400px] h-auto bg-bg rounded-3xl shadow-lg border border-border/70 px-8 py-10 md:px-10 md:py-12
                relative overflow-hidden">

        {/* Brand / title */}
        <div className="relative mb-6 text-center">
          <p className="inline-flex items-center justify-center size-15 rounded-full bg-primary text-white text-3xl font-semibold shadow-md mb-2">
            GG
          </p>
          <h1 className="text-3xl font-semibold text-heading">Glow & Grace</h1>
          <p className="text-xl text-text mt-2">
            Let's create an Account
          </p>
        </div>

        <div className="relative flex items-center bg-surface rounded-full p-1 mb-6 border border-border/70">
          <h1 className="flex-1 text-2xl font-medium py-2 rounded-full text-text-heading text-center"> Register</h1>
        </div>

        <div className="relative min-h-[220px]">
          {step === "form" && (
            <form
              onSubmit={handleSubmit}
              ref={formRef}
              className="space-y-4 transition-all duration-300 opacity-100 translate-y-0"
            >
              <div>
                <label className="block text-2xl font-medium text-heading mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  className="w-full rounded-xl border border-border/80 bg-bg px-4 py-3 text-2xl text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                  placeholder="Enter your name"
                />
                {errors.Name && (
                  <p className="text-red-500 text-xl mt-1">{errors.Name}</p>
                )}
              </div>

              <div>
                <label className="block text-2xl font-medium text-heading mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  className="w-full rounded-xl border border-border/80 bg-bg px-4 py-3 text-2xl text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xl mt-1">{errors.email}</p>
                )}

              </div>

              <div>
                <label className="block text-2xl font-medium text-heading mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full rounded-xl border border-border/80 bg-bg px-4 py-3 text-2xl text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                  placeholder="+91-98765 43210"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xl mt-1">{errors.phone}</p>
                )}

              </div>

              <div>
                <label className="block text-2xl font-medium text-heading mb-3">
                  Gender
                </label>

                <div className="flex items-center gap-6">
                  {/* Male */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      className="h-6 w-6 accent-primary"
                    />
                    <span className="text-2xl text-text-heading">Male</span>
                  </label>

                  {/* Female */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      className="h-6 w-6 accent-primary"
                    />
                    <span className="text-2xl text-text-heading">Female</span>
                  </label>
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-xl mt-1">{errors.gender}</p>
                )}

              </div>

              <div className="grid grid-cols-1  gap-3">
                <div>
                  <label className="block text-2xl font-medium text-heading mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "password" : "text"}
                      required
                      name="password"
                      className="w-full rounded-xl border border-border/80 bg-bg px-4 py-3 pr-12 text-2xl text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text text-2xl cursor-pointer hover:scale-110"
                    >
                      {showPassword ? <HiEyeOff /> : <HiEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xl mt-1">{errors.password}</p>
                  )}

                </div>
                <div>
                  <label className="block text-2xl font-medium text-heading mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "password" : "text"}
                      required
                      name="confirmPassword"
                      className="w-full rounded-xl border border-border/80 bg-bg px-4 py-3 pr-12 text-2xl text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text text-2xl cursor-pointer hover:scale-110"
                    >
                      {showConfirmPassword ? <HiEyeOff /> : <HiEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xl mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}

                </div>
              </div>

              {errors.server && (
                <p className="text-red-500 text-xl mt-2">
                  {errors.server}
                </p>
              )}


              <button
                type="submit"
                disabled={sendOtp.isPending}
                className="w-full mt-2 inline-flex items-center cursor-pointer justify-center rounded-xl bg-primary px-4 py-2.5 text-2xl font-medium text-white shadow-md hover:bg-primary-dark transition"
              >
                {sendOtp.isPending ? "Sending OTP..." : "Send OTP"}
              </button>


              <div className="flex justify-center items-center gap-2 mt-5">
                <p className=" text-center text-2xl text-text">
                  Already have an account?{" "} </p>
                <NavLink to={"/auth/login"}>
                  <span className="text-primary text-2xl font-medium hover:underline"> Sign in </span>
                </NavLink>
              </div>
            </form>
          )}
          {/* ================= STEP 2: OTP ================= */}
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
                onClick={() => verifyOtp.mutate({ email, otp })}
                disabled={verifyOtp.isPending}
                className="w-full bg-bg-dark text-white py-3 rounded-lg text-2xl mt-2 cursor-pointer"
              >
                {verifyOtp.isPending ? "Verifying..." : "Verify OTP"}
              </button>

              {/* Resend Section */}
              {timer > 0 ? (
                <p className="text-center text-gray-500 text-xl">
                  Resend OTP in {timer}s
                </p>
              ) : (
                <button
                  onClick={() => {
                    sendOtp.mutate({ email });
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
  </>
}