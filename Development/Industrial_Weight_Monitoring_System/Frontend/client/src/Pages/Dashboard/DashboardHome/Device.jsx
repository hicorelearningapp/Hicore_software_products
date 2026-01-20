import React from 'react';
import scanqricon from "../../../assets/Dashboard/Home/scan-qr.png";
import updownicon from "../../../assets/Dashboard/Home/up-down.png";

const items = [
  { title: "Item Name", value: "Face Masks (N95)" },
  { title: "Reorder Qty", value: "250 units" },
  { title: "Preferred Vendor", value: "ABC Suppliers" },
  { title: "Expected Stock-out Date", value: "28/11" },
];

const Device = () => {
  return (
    <div className="flex flex-col gap-[24px]">

      {/* ADD DEVICE CARD */}
      <div className="flex flex-col rounded-[24px] md:rounded-[36px] p-[16px] md:p-[20px] gap-[20px] border border-[#E7EAEC]">

        <h2 className="font-semibold text-[14px] md:text-[16px] leading-[24px] md:leading-[28px]">
          Add Device
        </h2>

        <div className="flex flex-col gap-[16px]">

          <input
            type="text"
            placeholder="Enter Device Name"
            className="rounded-[80px] px-[14px] md:px-[16px] py-[8px] border border-[#8A939B] focus:outline-none text-[13px] md:text-[14px]"
          />

          {/* QR INPUT */}
<div className="flex items-center gap-[8px] rounded-[80px] px-[14px] md:px-[16px] h-[44px] md:h-[48px] border border-[#8A939B]">
  <input
    type="text"
    placeholder="Enter Device ID / Scan QR"
    className="flex-1 bg-transparent focus:outline-none text-[13px] leading-[26px] md:text-[14px] py-[8px]"
  />
  <img
    src={scanqricon}
    className="w-[22px] h-[22px] md:w-[24px] md:h-[24px] cursor-pointer shrink-0"
    alt="scan qr"
  />
</div>

{/* CAPACITY INPUT */}
<div className="flex items-center gap-[8px] rounded-[80px] px-[14px] md:px-[16px] h-[44px] md:h-[48px] border border-[#8A939B]">
  <input
    type="text"
    placeholder="Enter Maximum Capacity (Kg)"
    className="flex-1 bg-transparent focus:outline-none text-[13px] md:text-[14px]"
  />
  <img
    src={updownicon}
    className="w-[22px] h-[22px] md:w-[24px] md:h-[24px] cursor-pointer shrink-0"
    alt="updown"
  />
</div>


          {/* BUTTON */}
          <button className="rounded-[80px] px-[16px] py-[8px] bg-[#0A2A43] hover:bg-[#F4F6F8] hover:text-[#0A2A43] hover:border-[#8A939B] hover:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)] text-white text-[14px] font-semibold leading-[26px] border border-[#E8F0FF]">
            Add Device
          </button>
        </div>
      </div>

      {/* AI ORDER PREDICT */}
      <div className="flex flex-col rounded-[24px] md:rounded-[36px] p-[16px] md:p-[20px] gap-[20px] border border-[#E7EAEC]">

        <div className="flex flex-col md:flex-row justify-between gap-[12px] md:gap-0 items-start md:items-center">
          <h2 className="font-semibold text-[14px] md:text-[16px] leading-[24px] md:leading-[28px]">
            AI Order Predict
          </h2>

          <div className="flex items-center rounded-[80px] px-[14px] py-[4px] bg-[#2ECC711A] text-[#2ECC71] text-[11px] md:text-[12px] leading-[20px] gap-2">
            <span>AI Confidence Score</span>
            <span>92%</span>
          </div>
        </div>

        {/* INFO GRID */}
        <div className="flex flex-col rounded-[16px] px-[14px] md:px-[16px] py-[8px] gap-[16px] border border-[#E7EAEC]">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col gap-2">
                <span className="text-[#0A2A43] text-[12px] font-regular leading-[20px]">
                  {item.title}
                </span>

                <span className="text-[#1769FF] text-[14px] font-semibold leading-[24px]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* ORDER BUTTON */}
          <button className="rounded-[80px] px-[16px] py-[8px] bg-[#0A2A43] hover:bg-[#F4F6F8] hover:text-[#0A2A43] hover:border-[#8A939B] hover:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)] text-white text-[14px] font-semibold leading-[26px] border border-[#E8F0FF]">
            Order Now
          </button>
        </div>

      </div>
    </div>
  );
};

export default Device;
