import React from "react";
import loginimage from "../../assets/Login/login.png";

const LoginNew = () => {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-10"
      style={{
        background:
          "linear-gradient(117.67deg, #115920 1.47%, #4D9554 41.4%, #89D188 59.37%, #115920 96.94%)",
      }}
    >
      {/* Outer white card that holds left image + center line + right content */}
      <div className="w-full max-w-[1100px] bg-white rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
        {/* LEFT — Illustration (hidden on small screens) */}
        <div className="flex-1 hidden md:flex items-center justify-center">
          <img
            src={loginimage}
            alt="login visual"
            className="w-full max-w-[460px] object-contain"
          />
        </div>

        {/* CENTER — Vertical separator (visible on md and up) */}
        <div className="hidden md:flex items-stretch">
          {/* Thin vertical line with subtle gradient */}
          <div
            className="w-[1px] h-[600px] rounded-full"
            style={{
              background:
                "linear-gradient(180deg, rgba(17,93,41,0.12) 0%, rgba(17,93,41,0.06) 50%, rgba(17,93,41,0.12) 100%)",
            }}
          />
        </div>

        {/* RIGHT — Content area (includes top welcome text + bordered form box) */}
        <div className="flex-1 w-full flex flex-col items-center">
          {/* Top headline & subtitle inside the white card */}
          <div className="w-full text-center mb-6">
            <h1 className="text-[#115D29] text-[24px] font-semibold">
              Welcome
            </h1>
            <p className="text-[16px] text-[#2c6a39] mt-2">
              Manage your stock, orders, and reports — all from one place.
            </p>
          </div>

          {/* Bordered form container */}
          <div className="w-full max-w-[520px] border border-gray-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-center text-[#115D29] text-[20px] font-semibold mb-3">
              Login/Register
            </h2>

            <div
              className="mx-auto w-full  h-1 rounded-full mb-5"
              style={{
                background:
                  "linear-gradient(90deg, rgba(17,93,41,1) 0%, rgba(68,129,74,0.8) 50%, rgba(17,93,41,1) 100%)",
              }}
            />

            <p className="text-md text-[#115D29] mb-5">
              Please select your role to continue
            </p>

            <div className="flex items-center justify-between w-full text-[14px] mb-10">
              <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                <input
                  type="radio"
                  name="role"
                  className="h-4 w-4 accent-[#115D29] border-[#115D29] focus:ring-0"
                />
                <span>Customer</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                <input
                  type="radio"
                  name="role"
                  className="h-4 w-4 accent-[#115D29] border-[#115D29] focus:ring-0"
                />
                <span>Retailer</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                <input
                  type="radio"
                  name="role"
                  className="h-4 w-4 accent-[#115D29] border-[#115D29] focus:ring-0"
                />
                <span>Distributor</span>
              </label>
            </div>

            <label className="block text-sm text-[#115D29] mb-2">
              Enter Your Mobile Number / Email ID
            </label>
            <input
              type="text"
              placeholder="Enter Your Mobile Number / Email ID"
              className="border border-[#115D29 ] w-full px-4 py-3 text-[#115D29] rounded-md outline-none focus:ring-0 focus:border-[#115D29] mb-4"
            />

            <button className=" bg-[#115D29]  text-white  shadow-md shadow-gray-400 w-full  py-3  rounded-md font-semibold  border-2 border-transparent hover:bg-[#0f4d22]  hover:border-white transition mb-4 ">
              Send OTP
            </button>

            <label className="flex items-center gap-3 mt-1 text-[14px] cursor-pointer mb-4">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 accent-[#115D29] focus:ring-0"
              />
              <span className="text-gray-700">Remember Me</span>
            </label>

            <div className="flex items-center my-4">
              <span className="flex-1 h-[1px] bg-gray-200"></span>
              <p className="px-3 text-gray-400 text-sm">Or</p>
              <span className="flex-1 h-[1px] bg-gray-200"></span>
            </div>

            <button className="border border-gray-200 py-3 rounded-md w-full flex items-center justify-center gap-3 text-gray-700 hover:bg-gray-50 transition mb-4">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-5 h-5"
              />
              Login with Google
            </button>

            <p className="text-center text-[14px] text-gray-500 mt-2 px-2 leading-relaxed">
              By continuing, you agree to HiCore PharmaCart’s{" "}
              <span className="underline cursor-pointer text-[#115D29]">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="underline cursor-pointer text-[#115D29]">
                Privacy Policy
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginNew;
