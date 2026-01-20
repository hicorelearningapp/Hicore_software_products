import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Assets
import bgImage from "../../assets/Login/loginbg.png";
//import googleicon from "../../assets/Login/googleicon.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const api = {
  login: `${API_BASE}/auth/login`,
  users: `${API_BASE}/users`,
};

const Login = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ Name: "", Email: "", MobileNo: "", Password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check for userId instead of token
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async () => {
    setError("");
    const { Name, Email, MobileNo, Password } = formData;

    if (!Email || !Password || (isRegistering && (!Name || !MobileNo))) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      if (isRegistering) {
        // REGISTER
        const response = await axios.get(api.users);
        const userList = response.data?.data || [];
        if (userList.find((u) => u.Email?.toLowerCase() === Email.toLowerCase())) {
          setError("User already registered with this email.");
          setLoading(false);
          return;
        }

        await axios.post(api.users, { Name, Email, MobileNo, Password });
        setIsRegistering(false);
        setError("Registration successful! Please login.");
        setFormData({ Name: "", Email: "", MobileNo: "", Password: "" });
      } else {
        const response = await axios.post(api.login, { Email, Password });
        const userId = response.data?.data?.UserId;

        if (userId) {
          localStorage.setItem("userId", userId);
          navigate("/dashboard", { replace: true });
        } else {
          setError("User not found.Please register and continue");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-cover bg-center opacity-[0.03]" style={{ backgroundImage: `url(${bgImage})` }} />
      <div className="relative flex flex-col min-h-screen p-[64px] gap-[64px] px-4 py-6 md:p-[64px]">
        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center justify-between rounded-[80px] bg-[#1769FF0D] px-[32px] py-[16px]">
          <span onClick={() => navigate("/")} className="font-semibold text-[16px] text-[#1769FF] cursor-pointer">HiCore InVue</span>
          <div className="flex gap-[28px] text-[#0A2A43] font-semibold">
            {["Home", "Features", "Why Us?", "Download App"].map((item) => (
              <span key={item} className="cursor-pointer px-[16px] py-[6px] rounded-[80px] hover:bg-white transition" onClick={() => navigate("/")}>{item}</span>
            ))}
          </div>
        </div>

        {/* LOGIN CARD */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-[540px] rounded-[80px] bg-[#1769FF0D] border border-[#1769FF] p-[36px]">
            <div className="flex flex-col items-center gap-[12px]">
              <h2 className="font-semibold text-[20px]">{isRegistering ? "Create Account" : "Welcome"}</h2>
              <p className="text-[16px] text-center">{isRegistering ? "Join us to manage your devices" : "Login to track devices, inventory, and orders"}</p>
            </div>

            <div className="mt-[36px] p-[36px] rounded-[80px] border border-[#B7D1FF] flex flex-col gap-[20px]">
              <h2 className="text-center font-semibold text-[20px]">{isRegistering ? "Register" : "Login"}</h2>
              {error && <p className={`text-center font-medium text-sm ${error.includes("successful") ? "text-green-600" : "text-red-600"}`}>{error}</p>}

              {isRegistering && (
                <>
                  <input name="Name" placeholder="Full Name" value={formData.Name} onChange={handleInputChange} className="rounded-[80px] py-[8px] px-[16px] border border-[#8A939B] outline-none focus:border-[#1769FF]" />
                  <input name="MobileNo" placeholder="Mobile Number" value={formData.MobileNo} onChange={handleInputChange} className="rounded-[80px] py-[8px] px-[16px] border border-[#8A939B] outline-none focus:border-[#1769FF]" />
                </>
              )}

              <input name="Email" type="email" placeholder="Email" value={formData.Email} onChange={handleInputChange} className="rounded-[80px] py-[8px] px-[16px] border border-[#8A939B] outline-none focus:border-[#1769FF]" />
              <input name="Password" type="password" placeholder="Password" value={formData.Password} onChange={handleInputChange} className="rounded-[80px] py-[8px] px-[16px] border border-[#8A939B] outline-none focus:border-[#1769FF]" />

              <button onClick={handleAuth} disabled={loading} className="bg-[#1769FF] text-white font-semibold py-[10px] rounded-[80px] hover:opacity-90 transition disabled:bg-gray-400">
                {loading ? "Processing..." : isRegistering ? "Sign Up" : "Login"}
              </button>

              <div className="flex items-center gap-2">
                <div className="flex-1 border-b" />
                <span className="text-[12px] text-gray-400">OR</span>
                <div className="flex-1 border-b" />
              </div>

              {/*<div className="flex items-center justify-center gap-2 border rounded-[80px] py-[8px] cursor-pointer bg-white hover:bg-[#F4F6F8] transition">
                <img src={googleicon} className="w-[20px]" alt="Google" />
                <span className="text-[14px]">Login with Google</span>
              </div>*/}

              <p className="text-center text-[14px]">
                {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
                <span className="text-[#1769FF] font-semibold cursor-pointer underline" onClick={() => { setIsRegistering(!isRegistering); setError(""); }}>
                  {isRegistering ? "Login here" : "Register here"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;