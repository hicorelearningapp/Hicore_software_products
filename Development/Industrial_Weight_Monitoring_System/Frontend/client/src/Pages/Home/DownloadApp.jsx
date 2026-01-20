import React from 'react'
import windowsicon from "../../assets/Home/windows-os.png";
import macosicon from "../../assets/Home/macos.png";
import googleplayicon from "../../assets/Home/google-play.png";
import macappicon from "../../assets/Home/mac-appstore.png";

const DownloadApp = () => {
  return (
    <div id="downloadapp"
      className="flex flex-col p-[100px] gap-[64px] rounded-t-[80px] max-md:p-[32px] max-md:gap-[40px]"
    >
      {/* Heading */}
      <div className="flex flex-col gap-[8px] items-center justify-center text-center px-2">
        <h2
          className="font-semibold text-[24px] leading-[36px] text-[#0A2A43] max-md:text-[20px]"
          style={{ letterSpacing: "0.01em" }}
        >
          DOWNLOAD <span className="text-[#1769FF]">HiCore InVue APPLICATION</span>
        </h2>

        <p className="text-[#8A939B] font-regular text-[16px] tracking-[1%] max-md:text-[14px]">
          Download Hicore InVue for desktop or mobile and stay connected to your stock.
        </p>
      </div>

      {/* Cards --> */}
      <div className="flex flex-row gap-[36px] max-md:flex-col max-md:gap-[24px]">
        {/* LEFT CARD --- Desktop App */}
        <div
          className="w-1/2 flex flex-col rounded-[80px] p-[64px] gap-[36px] border border-[#B7D1FF] shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)] max-md:w-full max-md:p-[24px] max-md:rounded-[40px]"
        >
          <div className="flex flex-col gap-[8px] items-center justify-center text-center">
            <h2 className="text-[20px] leading-[32px] font-semibold text-[#1D1F22] max-md:text-[18px]">
              Download for Desktop
            </h2>
            <p className="text-[#8A939B] text-[16px] leading-[28px] max-md:text-[14px]">
              Available for Windows & macOS. Fast, reliable desktop access.
            </p>
          </div>

          {/* Windows Button */}
          <div
            className="flex flex-row px-[16px] py-[8px] gap-[16px] rounded-[80px] select-none 
              bg-[#E8F0FF] hover:bg-[#F4F6F8] items-center justify-center 
              border border-[#E8F0FF] hover:border-[#8A939B]
              drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]
              hover:drop-shadow-none hover:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]
              max-md:w-full max-md:h-[60px]"
          >
            <img src={windowsicon} alt="" className="w-[48px] h-[48px] max-md:w-[36px] max-md:h-[36px]" />
            <h2 className="font-semibold text-[20px] leading-[32px] text-[#0A2A43] max-md:text-[16px]">
              Download for Windows
            </h2>
          </div>

          {/* macOS Button */}
          <div
            className="
              flex flex-row px-[16px] py-[8px] gap-[16px] rounded-[80px] select-none 
              bg-[#E8F0FF] hover:bg-[#F4F6F8] items-center justify-center 
              border border-[#E8F0FF] hover:border-[#8A939B]
              drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]
              hover:drop-shadow-none hover:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]
              max-md:w-full max-md:h-[60px]
            "
          >
            <img src={macosicon} alt="" className="w-[48px] h-[48px] max-md:w-[36px] max-md:h-[36px]" />
            <h2 className="font-semibold text-[20px] leading-[32px] text-[#0A2A43] max-md:text-[16px]">
              Download for macOS
            </h2>
          </div>
        </div>

        {/* RIGHT CARD --- Mobile App */}
        <div
          className="
            w-1/2 flex flex-col rounded-[80px] p-[64px] gap-[36px]
            border border-[#B7D1FF] shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]
            max-md:w-full max-md:p-[24px] max-md:rounded-[40px]
          "
        >
          <div className="flex flex-col gap-[8px] items-center justify-center text-center">
            <h2 className="text-[20px] leading-[32px] font-semibold text-[#1D1F22] max-md:text-[18px]">
              Download for Mobile
            </h2>
            <p className="text-[#8A939B] text-[16px] leading-[28px] max-md:text-[14px]">
              Stay connected with real-time inventory on the go.
            </p>
          </div>

          {/* Google Play */}
          <div
            className="
              flex flex-row px-[16px] py-[8px] gap-[16px] rounded-[80px] select-none
              bg-[#E8F0FF] hover:bg-[#F4F6F8] items-center justify-center 
              border border-[#E8F0FF] hover:border-[#8A939B]
              drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]
              hover:drop-shadow-none hover:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]
              max-md:w-full max-md:h-[60px]
            "
          >
            <img src={googleplayicon} alt="" className="w-[48px] h-[48px] max-md:w-[36px] max-md:h-[36px]" />
            <h2 className="font-semibold text-[20px] leading-[32px] text-[#0A2A43] max-md:text-[16px]">
              Google Play
            </h2>
          </div>

          {/* App Store */}
          <div
            className="
              flex flex-row px-[16px] py-[8px] gap-[16px] rounded-[80px] select-none
              bg-[#E8F0FF] hover:bg-[#F4F6F8] items-center justify-center 
              border border-[#E8F0FF] hover:border-[#8A939B]
              drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]
              hover:drop-shadow-none hover:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]
              max-md:w-full max-md:h-[60px]
            "
          >
            <img src={macappicon} alt="" className="w-[48px] h-[48px] max-md:w-[36px] max-md:h-[36px]" />
            <h2 className="font-semibold text-[20px] leading-[32px] text-[#0A2A43] max-md:text-[16px]">
              App Store
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;
