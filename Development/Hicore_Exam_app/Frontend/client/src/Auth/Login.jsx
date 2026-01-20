import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import studentsImg from "../assets/Auth/students.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  /* ---------- RESEND TIMER ---------- */
  useEffect(() => {
    if (resendTimer === 0) return;
    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  /* ---------- SEND OTP ---------- */
  const sendOtp = async () => {
    if (!value || !role) {
      setError("Please enter email and select role");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setOtpMessage("");

      const res = await fetch(`${API_BASE}/auth/send-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });

      if (!res.ok) throw new Error();

      setOtpSent(true);
      setOtp("");
      setOtpMessage("OTP sent successfully. Please check your inbox.");
      setResendTimer(60);
    } catch {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- VERIFY OTP ---------- */
  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    const normalizedRole = role.toLowerCase();

    try {
      setLoading(true);
      setError("");

      const verifyRes = await fetch(`${API_BASE}/auth/verify-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: value,
          otp,
          role: normalizedRole,
        }),
      });

      if (!verifyRes.ok) throw new Error();

      const verifiedUser = await verifyRes.json();

      /* ---------- STORE AUTH DATA ---------- */
      localStorage.setItem("token", verifiedUser.token || "logged-in");
      localStorage.setItem("userId", verifiedUser.user.id);
      localStorage.setItem("role", normalizedRole);
      localStorage.setItem("email", verifiedUser.user.email);

      await fetch(`${API_BASE}/auth/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: value,
          phone: "",
          role: normalizedRole,
        }),
      });

      /* ---------- REDIRECT TO HOME ---------- */
      navigate("/", { replace: true });
    } catch {
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RESEND OTP ---------- */
  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    sendOtp();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* LEFT IMAGE */}
        <div className="hidden md:flex justify-center">
          <img
            src={studentsImg}
            alt="Students"
            className="max-w-md w-full object-contain"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex flex-col items-center w-full">
          <div className="text-center mb-8">
            <h1 className="text-[#2758B3] text-2xl font-semibold">
              Let’s Get You Back to Learning
            </h1>
            <p className="text-md leading-[32px] text-[#2758B3] mt-2">
              Access your notes, practice tests, progress insights, and more –
              all
              <br /> in one place.
            </p>
          </div>

          <div className="border border-gray-300 rounded-xl p-12 max-w-[535px] w-full">
            <h2 className="text-center text-[#2758B3] text-xl font-semibold mb-8">
              Login / Register
            </h2>

            <div className="h-[2px] bg-[#2758B3] my-4" />

            <p className="text-[14px] mt-8 text-[#2758B3] mb-4">
              Please select your role to continue
            </p>

            {/* ROLE */}
            <div className="flex justify-between mb-6">
              {["Student", "Teacher", "Parent"].map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 text-[14px] text-[#2758B3]"
                >
                  <input
                    type="radio"
                    name="role"
                    value={item}
                    checked={role === item}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  {item}
                </label>
              ))}
            </div>

            {/* EMAIL */}
            <label className="text-sm text-[#2758B3]">
              Enter Your Mobile Number / Email ID
            </label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full mt-2 px-4 py-2 border border-[#999999] rounded-full"
            />

            {/* OTP */}
            {otpSent && (
              <>
                <p className="text-green-600 text-sm mt-4 text-center">
                  {otpMessage}
                </p>

                <label className="text-sm text-[#2758B3] mt-6 block">
                  Enter OTP
                </label>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full mt-2 px-4 py-2 border border-[#999999] rounded-full"
                />

                <div className="text-center mt-3">
                  <button
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0}
                    className="text-sm text-[#2758B3] font-semibold disabled:text-gray-400"
                  >
                    {resendTimer > 0
                      ? `Resend OTP in ${resendTimer}s`
                      : "Resend OTP"}
                  </button>
                </div>
              </>
            )}

            <button
              onClick={otpSent ? handleVerifyOtp : sendOtp}
              disabled={loading}
              className="w-full bg-[#2758B3] text-white py-2 rounded-full mt-6 font-semibold"
            >
              {otpSent ? "Verify OTP" : "Send OTP"}
            </button>

            {error && (
              <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
