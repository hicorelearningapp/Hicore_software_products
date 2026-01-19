import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import loginImage from "../../assets/Login/loginIcon.png";
import googleIcon from "../../assets/Login/Google.png";
import linkedinIcon from "../../assets/Login/Linkedin.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const LoginNew = () => {
  const [role, setRole] = useState("Jobseeker");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Store where the user came from (fallback to current page or home)
  const from = location.state?.from || window.location.pathname || "/";

  // 🔁 Keep login status synced
  useEffect(() => {
    const handler = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };
    window.addEventListener("loginStatusChanged", handler);
    return () => window.removeEventListener("loginStatusChanged", handler);
  }, []);

  // ==========================================================
  //  Handle Send OTP
  // ==========================================================
  const handleSendOtp = async () => {
    if (!role) return alert("Please select your role");
    if (!emailOrPhone) return alert("Please enter your email ID");

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/auth/send-email-otp`, {
        email: emailOrPhone,
      });

      if (response.status === 200) {
        alert("OTP sent successfully!");
        setOtpSent(true);
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert(
        error.response?.data?.detail ||
          "Failed to send OTP. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  //  Handle Verify OTP + Save User Info
  // ==========================================================
  const handleVerifyOtp = async () => {
    if (!otp) return alert("Please enter the OTP");

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/auth/verify-email-otp`, {
        email: emailOrPhone,
        otp,
        role: role.toLowerCase(),
      });

      if (response.status === 200) {
        alert("Login successful!");

        const user = response.data?.user || {};
        const userId = user.id || user.user_id || response.data?.id;
        const userEmail = user.email || emailOrPhone;
        const userRole = user.role || role.toLowerCase();

        // ✅ Save user info
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user_id", userId);
        localStorage.setItem("userId", userId);
        localStorage.setItem("email", userEmail);
        localStorage.setItem("userEmail", userEmail);
        localStorage.setItem("role", userRole);
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userData", JSON.stringify(user));

        console.log("✅ User info saved:", { userId, userEmail, userRole });

        // 🔄 Notify app state
        window.dispatchEvent(new Event("loginStatusChanged"));
        setIsLoggedIn(true);

        // ✅ Smart Redirect Logic
        if (from === "/login" || from === window.location.pathname) {
          console.log("🏠 Redirecting to Home after direct login");
          navigate("/", { replace: true });
        } else {
          console.log("🔁 Redirecting back to previous page:", from);
          navigate(from, { replace: true });
        }
      } else {
        alert("Invalid OTP or login failed.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert(
        error.response?.data?.detail ||
          "Invalid OTP or login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  //  Resend OTP
  // ==========================================================
  const handleResendOtp = () => {
    setOtp("");
    handleSendOtp();
  };

  // ==========================================================
  //  UI
  // ==========================================================
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-10">
      <div className="flex flex-col md:flex-row w-full max-w-7xl items-center justify-center gap-10 md:gap-20">
        {/* Left Image */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <img
            src={loginImage}
            alt="Login Visual"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 max-w-[500px]">
          {!isLoggedIn ? (
            <>
              <h2 className="text-center text-2xl font-bold text-indigo-900 mb-2">
                Welcome
              </h2>
              <p className="text-center text-sm text-gray-600 mb-6">
                Access personalized mentorship, hands-on projects,
                certifications, and career opportunities — all in one place.
              </p>

              <div className="bg-white border rounded-lg shadow-md p-6 md:p-10">
                <h2 className="text-center text-xl font-semibold text-indigo-900 mb-6">
                  Login/Register
                </h2>

                <p className="text-sm text-indigo-900 mb-4 text-center">
                  Please select your role to continue
                </p>
                <div className="flex justify-center gap-4 mb-6 text-sm">
                  {["Student", "Jobseeker", "Mentor", "Employer"].map((r) => (
                    <label key={r} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="role"
                        value={r}
                        checked={role === r}
                        onChange={(e) => setRole(e.target.value)}
                        className="accent-indigo-900"
                      />
                      {r}
                    </label>
                  ))}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-indigo-900 mb-1">
                    Enter Your Email ID
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your email"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
                  />
                </div>

                {otpSent && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-indigo-900 mb-1">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      placeholder="Enter the OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm tracking-widest"
                    />
                  </div>
                )}

                {!otpSent ? (
                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full bg-indigo-900 text-white py-2 rounded hover:bg-indigo-800 text-sm transition disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleVerifyOtp}
                      disabled={loading}
                      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-500 text-sm transition disabled:opacity-50"
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>

                    <button
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="w-full mt-3 border border-indigo-900 text-indigo-900 py-2 rounded hover:bg-indigo-50 text-sm transition disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  </>
                )}
                <p className="text-xs text-gray-500 mt-4 leading-relaxed text-center">
                  By continuing, you agree to HiCore Career Project Platform's{" "}
                  <span className="text-indigo-700 underline cursor-pointer">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-indigo-700 underline cursor-pointer">
                    Privacy Policy
                  </span>
                  .
                </p>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LoginNew;
