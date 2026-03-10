import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Mail,
  Lock,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PasswordRestOtp = () => {
  const [step, setStep] = useState("otp"); // 'otp', 'password', 'success'
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Changed to 6 digits
  const user = JSON.parse(localStorage.getItem("userdata"));
  const [email] = useState(user?.email || "");
  const [timer, setTimer] = useState(180); // 3 minutes
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  sendOtp();
}, []);

const sendOtp = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/auth/send-reset-otp",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

  } catch (err) {
    console.error("OTP send failed", err);
  }
};

  // References for 6 inputs
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // Countdown Timer logic
  useEffect(() => {
    let interval;
    if (timer > 0 && step === "otp") {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer, step]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // OTP Input Handlers
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    // Take only the last character entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setIsError(false);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

const verifyOtp = async () => {
  try {
    setIsLoading(true);

    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/auth/verify-reset-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          otp: otp.join("")
        })
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    setStep("password");

  } catch (err) {
    setIsError(true);
  } finally {
    setIsLoading(false);
  }
};

const resendOtp = async () => {
  try {
    const token = localStorage.getItem("token");

    await fetch(
      "http://localhost:5000/api/auth/send-reset-otp",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setTimer(180);
    setOtp(['', '', '', '', '', '']);
    setIsError(false);
    otpRefs[0].current.focus();

  } catch (err) {
    console.error(err);
  }
};

  // Password Validation Logic
  const validation = {
    length: password.length >= 8,
    capital: /[A-Z]/.test(password),
    small: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };

  const strengthScore = Object.values(validation).filter(Boolean).length;
  const isPasswordStrong = strengthScore === 5;
  const passwordsMatch = password && password === confirmPassword;

const handleUpdatePassword = async () => {
  try {
    setIsLoading(true);

    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/auth/reset-password-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          otp: otp.join(""),
          newPassword: password
        })
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    setStep("success");

  } catch (err) {
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out border border-emerald-50">
        {/* Header Section */}
        <div className="bg-emerald-500 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {step === "otp" && (
              <Mail className="w-12 h-12 mb-4 animate-bounce" />
            )}
            {step === "password" && (
              <Lock className="w-12 h-12 mb-4 animate-pulse" />
            )}
            {step === "success" && (
              <CheckCircle2 className="w-16 h-16 mb-2 text-emerald-100" />
            )}

            <h1 className="text-2xl font-bold">
              {step === "otp" && "Verify OTP"}
              {step === "password" && "Set New Password"}
              {step === "success" && "All Set!"}
            </h1>
            <p className="text-emerald-50 text-sm mt-2 opacity-90">
              {step === "otp" && `Enter the 6-digit code sent to ${email}`}
              {step === "password" &&
                "Choose a strong password for your account"}
              {step === "success" &&
                "Your security has been updated successfully"}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {/* STEP 1: OTP VERIFICATION (6 Digits) */}
          {step === "otp" && (
            <div
              className={`space-y-6 transition-all duration-300 ${isError ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
            >
              <div className="flex justify-between gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpRefs[idx]}
                    type="text"
                    maxLength="1"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-bold rounded-xl border-2 transition-all 
                      ${isError ? "border-red-400 bg-red-50 text-red-600" : "border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"} 
                      outline-none text-slate-700 shadow-sm`}
                  />
                ))}
              </div>

              {isError && (
                <div className="flex items-center gap-2 text-red-500 text-sm justify-center bg-red-50 p-2 rounded-lg animate-in fade-in zoom-in-95">
                  <XCircle size={16} />
                  <span>Invalid 6-digit code. Please try again.</span>
                </div>
              )}

              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-slate-500 text-sm">
                    Resend code in{" "}
                    <span className="font-mono font-bold text-emerald-600">
                      {formatTime(timer)}
                    </span>
                  </p>
                ) : (
                  <button
                    onClick={resendOtp}
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-semibold mx-auto transition-transform active:scale-95"
                  >
                    <RefreshCcw size={16} /> Resend OTP
                  </button>
                )}
              </div>

              <button
                disabled={otp.some((d) => !d) || isLoading}
                onClick={verifyOtp}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Verify Identity{" "}
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 2: PASSWORD RESET */}
          {step === "password" && (
            <div className="space-y-6 animate-in slide-in-from-right duration-500">
              <div className="space-y-4">
                <div className="relative">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                    New Password
                  </label>
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-9 text-slate-400 hover:text-emerald-500"
                  >
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Strength Meter */}
                <div className="space-y-2">
                  <div className="flex gap-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    {[1, 2, 3, 4, 5].map((idx) => (
                      <div
                        key={idx}
                        className={`h-full flex-1 transition-all duration-500 ${
                          idx <= strengthScore
                            ? strengthScore < 3
                              ? "bg-red-400"
                              : strengthScore < 5
                                ? "bg-amber-400"
                                : "bg-emerald-500"
                            : "bg-transparent"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <ValidationItem
                      met={validation.length}
                      text="8+ Characters"
                    />
                    <ValidationItem met={validation.capital} text="Uppercase" />
                    <ValidationItem met={validation.small} text="Lowercase" />
                    <ValidationItem met={validation.number} text="Numbers" />
                    <ValidationItem
                      met={validation.special}
                      text="Special Char"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full p-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all
                      ${confirmPassword && !passwordsMatch ? "border-red-300" : "border-slate-200"}`}
                    placeholder="••••••••"
                  />
                  {passwordsMatch && confirmPassword && (
                    <CheckCircle2
                      size={18}
                      className="absolute right-4 top-10 text-emerald-500"
                    />
                  )}
                </div>
              </div>

              <button
                disabled={!isPasswordStrong || !passwordsMatch || isLoading}
                onClick={handleUpdatePassword}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-100"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === "success" && (
            <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="py-4">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <ShieldCheck className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Password Updated
                </h2>
                <p className="text-slate-500 mt-2">
                  Your account is now fully secured.
                </p>
              </div>

              <button
                onClick={() => navigate("/student")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-100"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
            Secure Verification System
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-8px); }
        }
      `}</style>
    </div>
  );
};

const ValidationItem = ({ met, text }) => (
  <div className="flex items-center gap-1.5">
    <div
      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${met ? "bg-emerald-500" : "bg-slate-200"}`}
    >
      <CheckCircle2 size={10} className="text-white" />
    </div>
    <span
      className={`text-[10px] font-bold uppercase tracking-tight ${met ? "text-emerald-600" : "text-slate-400"}`}
    >
      {text}
    </span>
  </div>
);

export default PasswordRestOtp;
