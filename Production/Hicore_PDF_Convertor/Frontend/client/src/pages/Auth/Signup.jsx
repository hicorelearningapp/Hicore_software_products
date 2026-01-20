import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

import loginicon from "../../assets/Login/loginicon.png";
import profileicon from "../../assets/Login/Profile.png";
import passwordicon from "../../assets/Login/Password.png";
import googleicon from "../../assets/Login/googlelogo.png";

const Signup = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!agreed) return;

    try {
      const res = await fetch("/api/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name: name }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful! Please login with your credentials.");
        navigate("/login");
      } else {
        if (data.detail === "Email already registered") {
          alert(
            "An account with this email already exists. Please login instead."
          );
          navigate("/login");
        } else {
          alert(data.detail || data.message || "Signup failed");
        }
      }
    } catch (err) {
      console.error("Signup Error:", err);
      alert("Signup failed");
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("/api/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        const data = await res.json();

        if (res.ok && (data.access_token || data.token)) {
          localStorage.setItem("token", data.access_token || data.token);
          window.dispatchEvent(new Event("authChange"));
          navigate("/");
          window.location.reload();
        }
      } catch (err) {
        console.error("Google Auth Network Error", err);
      }
    },
    onError: (err) => {
      console.error("Google Popup Error:", err);
    },
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* LEFT SIDE (IMAGE / INFO) */}
      <div
        className="
          w-full md:w-[50%]
          rounded-none md:rounded-tr-[80px] md:rounded-br-[80px]
          px-[24px] py-[48px] md:p-[100px]
          bg-[linear-gradient(92.35deg,#EBE6E6_1.81%,#FAFAFA_97.97%)]
          flex items-center justify-center
        "
      >
        <div className="flex flex-col gap-[32px] md:gap-[48px] items-center justify-center text-[#A0011B]">
          <img
            src={loginicon}
            className="w-[200px] h-[200px] md:w-[290px] md:h-[290px]"
            alt=""
          />

          <div className="flex flex-col gap-[16px] md:gap-[24px] text-center">
            <label className="text-[24px] md:text-[38px] leading-[36px] md:leading-[56px]">
              Create Your Free PDFinity Account
            </label>
            <label className="text-[14px] md:text-[20px] leading-[24px] md:leading-[42px]">
              Join thousands of users simplifying their document workflow with
              AI-powered tools.
            </label>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div
        className="
          flex flex-col
          w-full md:w-[50%]
          px-[24px] py-[48px] md:p-[100px]
          gap-[24px] md:gap-[36px]
          items-center justify-center
        "
      >
        <label className="text-[28px] md:text-[36px] font-bold leading-[40px] md:leading-[48px] text-[#B2011E]">
          Signup Now
        </label>

        <div className="flex flex-col gap-[20px] md:gap-[24px] w-full max-w-[420px]">
          {/* FULL NAME */}
          <InputField
            label="Full Name"
            icon={profileicon}
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* EMAIL */}
          <InputField
            label="Email ID"
            icon={profileicon}
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <InputField
            label="Password"
            icon={passwordicon}
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* CONFIRM PASSWORD */}
          <InputField
            label="Confirm Password"
            icon={passwordicon}
            placeholder="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* TERMS CHECKBOX */}
          <label className="flex items-start gap-[8px] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="hidden"
            />

            <div className="w-[24px] h-[24px] rounded-[4px] border-[1.5px] border-[#B2011E] flex items-center justify-center mt-[2px]">
              {agreed && (
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                  <path
                    d="M1 5L5 9L13 1"
                    stroke="#B2011E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>

            <span className="text-[14px] leading-[24px] md:leading-[28px] text-[#0A2A43]">
              I agree to the{" "}
              <span className="text-[#B2011E] cursor-pointer">
                Terms & Conditions
              </span>{" "}
              and{" "}
              <span className="text-[#B2011E] cursor-pointer">
                Privacy Policy
              </span>
            </span>
          </label>

          {/* CREATE ACCOUNT BUTTON */}
          <button
            onClick={handleSignup}
            disabled={!agreed}
            className={`w-full rounded-[8px] px-[16px] py-[10px] text-[16px] leading-[28px]
              ${
                agreed
                  ? "bg-[#B2011E] hover:bg-[#8E0118] text-white"
                  : "bg-[#E5E5E5] text-[#9E9E9E] cursor-not-allowed"
              }`}
          >
            Create Account
          </button>

          {/* OR */}
          <div className="flex items-center justify-center gap-[8px]">
            <div className="flex-1 border-t border-[#B8B8B8]" />
            <span className="text-[14px] text-[#B8B8B8]">Or</span>
            <div className="flex-1 border-t border-[#B8B8B8]" />
          </div>

          {/* GOOGLE SIGNUP */}
          <div
            onClick={() => login()}
            className="flex items-center justify-center gap-[8px] px-[16px] py-[10px] rounded-[8px] border border-[#A1A4A7] cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <img src={googleicon} className="w-[20px] h-[20px]" alt="" />
            <span className="text-[16px] leading-[24px]">
              Signup with Google
            </span>
          </div>

          {/* LOGIN LINK */}
          <div className="flex gap-[8px] justify-center text-[16px] leading-[28px]">
            <span>Already have an account?</span>
            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer hover:text-[#B2011E]"
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 🔹 Reusable Input Field */
const InputField = ({
  label,
  icon,
  placeholder,
  type = "text",
  value,
  onChange,
}) => (
  <div className="flex flex-col gap-[4px]">
    <label className="text-[14px] leading-[28px]">{label}</label>
    <div className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[8px] border border-[#ADADAD]">
      <img src={icon} className="w-[16px] h-[16px]" alt="" />
      <input
        type={type}
        placeholder={placeholder}
        className="w-full border-none outline-none bg-transparent text-[16px]"
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

export default Signup;
