import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

import mailicon from "../../assets/Login/Mail.png";
import passwordicon from "../../assets/Login/Password.png";
import googleicon from "../../assets/Login/googlelogo.png";
import loginicon from "../../assets/Login/loginicon.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await fetch("/api/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Login response status:", res.status);
      const data = await res.json();
      console.log("Login response data:", data);

      if (res.ok) {
        localStorage.setItem("token", "email_login");
        window.dispatchEvent(new Event("authChange"));
        navigate("/");
      } else {
        const errorMsg = data.detail || data.message || "";
        if (
          errorMsg.includes("not found") ||
          errorMsg.includes("not registered") ||
          errorMsg.includes("Invalid email")
        ) {
          alert("No account found with this email. Please sign up first.");
          navigate("/signup");
        } else {
          alert(errorMsg || "Login failed");
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Login failed");
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google login success:", tokenResponse);
      try {
        const res = await fetch("/api/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        const data = await res.json();
        console.log("Backend response:", res.status, data);

        if (res.ok && (data.access_token || data.token)) {
          localStorage.setItem("token", data.access_token || data.token);
          window.dispatchEvent(new Event("authChange"));
          navigate("/");
        }
      } catch (err) {
        console.error("Google Auth Error:", err);
      }
    },
    onError: (err) => {
      console.error("Google Popup Error:", err);
    },
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* LEFT SIDE (FORM) */}
      <div className="flex flex-col w-full md:w-[50%] px-[24px] py-[48px] md:p-[100px] gap-[16px] items-center justify-center">
        <div className="flex flex-col p-[24px] md:p-[36px] gap-[24px] md:gap-[36px] w-full max-w-[480px]">
          <h2 className="font-bold text-[28px] md:text-[36px] leading-[40px] md:leading-[48px] text-center text-[#B2011E]">
            Login Now
          </h2>

          <div className="flex flex-col gap-[24px] md:gap-[36px]">
            {/* FORM */}
            <div className="flex flex-col gap-[16px]">
              {/* EMAIL */}
              <div className="flex flex-col gap-[4px]">
                <h2 className="text-[14px] leading-[28px]">Email ID</h2>
                <div className="w-full flex items-center gap-[8px] px-[16px] py-[8px] rounded-[8px] border border-[#ADADAD]">
                  <img src={mailicon} className="w-[16px] h-[16px]" alt="" />
                  <input
                    type="text"
                    placeholder="Enter Email ID"
                    className="w-full border-none outline-none bg-transparent text-[16px]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col gap-[4px]">
                <h2 className="text-[14px] leading-[28px]">Password</h2>
                <div className="w-full flex items-center gap-[8px] px-[16px] py-[8px] rounded-[8px] border border-[#ADADAD]">
                  <img
                    src={passwordicon}
                    className="w-[16px] h-[16px]"
                    alt=""
                  />
                  <input
                    type="password"
                    placeholder="Enter Password"
                    className="w-full border-none outline-none bg-transparent text-[16px]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="text-[14px] leading-[28px] cursor-pointer">
                Forget Password
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              onClick={handleLogin}
              className="rounded-[8px] px-[16px] py-[10px] md:py-[8px] bg-[#B2011E] hover:bg-[#8E0118] text-white text-[16px] leading-[28px]"
            >
              Login
            </button>

            {/* OR */}
            <div className="flex items-center justify-center gap-[8px]">
              <div className="flex-1 border-t border-[#B8B8B8]" />
              <span className="text-[16px] text-[#B8B8B8]">Or</span>
              <div className="flex-1 border-t border-[#B8B8B8]" />
            </div>

            {/* GOOGLE LOGIN */}
            <div className="w-full flex justify-center">
              <div
                onClick={() => login()}
                className="w-full flex items-center justify-center gap-[8px] px-[16px] py-[10px] md:py-[8px] rounded-[8px] border border-[#A1A4A7] cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <img src={googleicon} className="w-[20px] h-[20px]" alt="" />
                <span className="text-[16px]">Login with Google</span>
              </div>
            </div>

            {/* SIGNUP */}
            <div className="flex gap-[8px] items-center justify-center text-[16px] leading-[28px]">
              <span>Don’t have an account?</span>
              <span
                onClick={() => navigate("/signup")}
                className="hover:text-[#B2011E] cursor-pointer"
              >
                SignUp
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-[50%] flex flex-col rounded-none md:rounded-tl-[80px] md:rounded-bl-[80px] px-[24px] py-[48px] md:p-[100px] gap-[24px] md:gap-[48px] bg-[linear-gradient(92.35deg,#EBE6E6_1.81%,#FAFAFA_97.97%)] items-center justify-center">
        <img
          src={loginicon}
          className="w-[200px] h-[200px] md:w-[290px] md:h-[290px]"
          alt=""
        />

        <h2 className="text-[24px] md:text-[38px] leading-[36px] md:leading-[56px] text-[#A0011B] text-center">
          Sign in to your account
        </h2>

        <p className="text-[14px] md:text-[20px] leading-[24px] md:leading-[42px] text-[#A0011B] text-center">
          We value your privacy. PDFinity uses end-to-end encryption, and your
          files are never stored without your permission.
        </p>
      </div>
    </div>
  );
};

export default Login;
