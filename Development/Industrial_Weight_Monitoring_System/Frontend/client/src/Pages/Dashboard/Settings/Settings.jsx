import React, { useState } from 'react'
import closeicon from '../../../assets/Dashboard/Inventory/close.png';
import uploadicon from '../../../assets/Dashboard/Settings/Upload.png';
import addicon from '../../../assets/Dashboard/Settings/Add.png';

const Settings = ({ onClose }) => {
  const [lowStock, setLowStock] = useState(true);
  const [critical, setCritical] = useState(true);
  const [reorder, setReorder] = useState(true);
  const [health, setHealth] = useState(true);
  const [battery, setBattery] = useState(true);
  const [update, setupdate] = useState(true);
  const [offline, setoffline] = useState(true);

  return (
    <>
      <div className='flex flex-col rounded-[30px] p-[36px] gap-[20px] h-full bg-white border border-[#8A939B] overflow-hidden'>
        
        {/* Header Section - Does not scroll */}
        <div className='flex justify-between pr-[8px] shrink-0'>
          <span className='font-semibold text-[20px] leading-[32px] tracking-[1%] text-[#0A2A43]'>
            Profile & Account Settings
          </span>
          <img 
            src={closeicon} 
            alt="close" 
            className='w-[20px] h-[20px] cursor-pointer hover:opacity-70 transition-opacity' 
            onClick={onClose}
          />
        </div>

        {/* Scrollable Container Section */}
        <div className='flex flex-col gap-[36px] overflow-y-auto pr-[10px] settings-scroll'>
          
          {/* Profile Information */}
          <div className='flex flex-col gap-[20px] p-[20px] rounded-[36px] border border-[#B3BDC5] shrink-0'>
            <span className='font-semibold text-[16px] leading-[28px] text-[#0A2A43]'>
              Profile Information
            </span>
            <div className='flex flex-col rounded-[8px] gap-[16px]'>
              <div className='flex flex-row gap-[16px]'>
                <div className='w-[50%] flex flex-col gap-[4px]'>
                  <label className='text-[14px] leading-[26px] text-[#0A2A43]'>Name</label>
                  <input type='text' placeholder='Enter Your Name' className='rounded-[80px] px-[16px] py-[8px] border border-[#8A939B] text-[14px] outline-none focus:border-[#1769FF]'/>
                </div>
                <div className='flex w-[50%] flex-col gap-[4px]'>
                  <label className='text-[14px] leading-[26px] text-[#0A2A43]'>Profile Picture</label>
                  <button className='flex flex-row rounded-[80px] px-[16px] py-[4px] gap-[8px] bg-[#F4F6F8] border border-[#1769FF] items-center justify-center hover:bg-blue-50 transition-colors'>
                    <img src={uploadicon} className='w-[24px] h-[24px]' alt="upload"/>
                    <span className='font-semibold text-[14px] leading-[26px] text-[#1769FF]'>Upload Image</span>
                  </button>
                </div>
              </div>

              <div className='flex flex-row gap-[16px]'>
                <div className='w-[50%] flex flex-col gap-[4px]'>
                  <label className='text-[14px] leading-[26px] text-[#0A2A43]'>Email</label>
                  <input type='text' placeholder='Enter your Email' className='rounded-[80px] px-[16px] py-[8px] border border-[#8A939B] text-[14px] outline-none'/>
                </div>
                <div className='w-[50%] flex flex-col gap-[4px]'>
                  <label className='text-[14px] leading-[26px] text-[#0A2A43]'>Phone Number</label>
                  <input type='text' placeholder='Enter 10 digit Number' className='rounded-[80px] px-[16px] py-[8px] border border-[#8A939B] text-[14px] outline-none'/>
                </div>
              </div>

              <div className='flex flex-col gap-[4px]'>
                <label className='text-[14px] leading-[26px] text-[#0A2A43]'>Address</label>
                <input type='text' placeholder='Enter your address here' className='rounded-[80px] px-[16px] py-[8px] border border-[#8A939B] text-[14px] outline-none'/>
              </div>

              <div className='flex flex-row gap-[16px]'>
                <div className='w-[50%] flex flex-col gap-[4px]'>
                  <label className='text-[14px] leading-[26px] text-[#0A2A43]'>Inventory Name</label>
                  <input type='text' placeholder='Enter Inventory Name' className='rounded-[80px] px-[16px] py-[8px] border border-[#8A939B] text-[14px] outline-none'/>
                </div>
                <div className='w-[50%] flex flex-col gap-[4px]'>
                  <label className='text-[14px] leading-[26px] text-[#0A2A43]'>Branch Location</label>
                  <input type='text' placeholder='Enter your Branch Location' className='rounded-[80px] px-[16px] py-[8px] border border-[#8A939B] text-[14px] outline-none'/>
                  <div className='flex flex-row gap-[8px] mt-2 cursor-pointer hover:opacity-80 transition-opacity'>
                    <img src={addicon} className='w-[24px] h-[24px]' alt="add"/>
                    <span className='text-[14px] leading-[26px] text-[#1769FF]'>Add Branch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Information */}
          <div className='flex flex-col gap-[20px] p-[20px] rounded-[36px] border border-[#B3BDC5] shrink-0 mb-4'>
            <span className='font-semibold text-[16px] leading-[28px] text-[#0A2A43]'>
              Inventory Information
            </span>
            <div className='flex flex-col rounded-[8px] gap-[16px]'>
              <div className='flex flex-row gap-[16px]'>
                <div className='w-[50%] flex flex-col gap-[4px]'>
                  <label className='text-[14px] leading-[26px] text-[#0A2A43]'>Inventory Name</label>
                  <input type='text' placeholder='Enter Inventory Name' className='rounded-[80px] px-[16px] py-[8px] border border-[#8A939B] text-[14px] outline-none'/>
                </div>
                <div className='flex w-[50%] flex-col gap-[4px]'>
                  <label className='text-[14px] leading-[26px] text-[#0A2A43]'>Inventory Picture</label>
                  <button className='flex flex-row rounded-[80px] px-[16px] py-[4px] gap-[8px] bg-[#F4F6F8] border border-[#1769FF] items-center justify-center hover:bg-blue-50 transition-colors'>
                    <img src={uploadicon} className='w-[24px] h-[24px]' alt="upload"/>
                    <span className='font-semibold text-[14px] leading-[26px] text-[#1769FF]'>Upload Image</span>
                  </button>
                </div>
              </div>

              <div className='flex flex-col gap-[4px]'>
                <label className='text-[14px] leading-[26px] text-[#0A2A43]'>Address</label>
                <input type='text' placeholder='Enter your address here' className='rounded-[80px] px-[16px] py-[8px] border border-[#8A939B] text-[14px] outline-none'/>
              </div>

              <div className='flex flex-col gap-[4px]'>
                <label className='text-[14px] leading-[26px] text-[#0A2A43]'>Branch Location</label>
                <input type='text' placeholder='Enter your Branch Location' className='rounded-[80px] px-[16px] py-[8px] border border-[#8A939B] text-[14px] outline-none'/>
                <div className='flex flex-row gap-[8px] mt-2 cursor-pointer'>
                  <img src={addicon} className='w-[24px] h-[24px]' alt="add"/>
                  <span className='text-[14px] leading-[26px] text-[#1769FF]'>Add Branch</span>
                </div>
              </div>

              <div className='flex flex-row gap-[16px]'>
                <div className='w-[50%] flex flex-col gap-[4px]'>
                  <label className='text-[14px] leading-[26px] text-[#0A2A43]'>Email</label>
                  <input type='text' placeholder='Enter your Email' className='rounded-[80px] px-[16px] py-[8px] border border-[#8A939B] text-[14px] outline-none'/>
                </div>
                <div className='w-[50%] flex flex-col gap-[4px]'>
                  <label className='text-[14px] leading-[26px] text-[#0A2A43]'>Phone Number</label>
                  <input type='text' placeholder='Enter 10 digit Number' className='rounded-[80px] px-[16px] py-[8px] border border-[#8A939B] text-[14px] outline-none'/>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-[20px] p-[20px] rounded-[36px] border border-[#B3BDC5] shrink-0 mb-4'>
            <span className='font-semibold text-[16px] leading-[28px] text-[#0A2A43]'>
              Notification Settings
            </span>
            <div className='flex flex-row gap-[20px]'>
              <div className="w-[50%] flex flex-col gap-[16px] rounded-[36px] p-[16px] border border-[#B3BDC5]">
      <span className="font-semibold text-[14px] leading-[26px] text-[#0A2A43]">
        Inventory Notifications
      </span>

      {/* Low Stock Alerts */}
      <div className="flex items-center justify-between">
        <span className="text-[14px] text-[#0A2A43]">Low Stock Alerts</span>
        <button
          onClick={() => setLowStock(!lowStock)}
          className={`w-[48px] h-[26px] rounded-full p-[3px] transition-all duration-300
            ${lowStock ? "bg-[#2E6CF6]" : "bg-[#D1D5DB]"}`}
        >
          <div
            className={`w-[20px] h-[20px] bg-white rounded-full shadow-md transition-all duration-300
              ${lowStock ? "translate-x-[22px]" : "translate-x-0"}`}
          />
        </button>
      </div>

      {/* Critical Alerts */}
      <div className="flex items-center justify-between">
        <span className="text-[14px] text-[#0A2A43]">Critical Alerts</span>
        <button
          onClick={() => setCritical(!critical)}
          className={`w-[48px] h-[26px] rounded-full p-[3px] transition-all duration-300
            ${critical ? "bg-[#2E6CF6]" : "bg-[#D1D5DB]"}`}
        >
          <div
            className={`w-[20px] h-[20px] bg-white rounded-full shadow-md transition-all duration-300
              ${critical ? "translate-x-[22px]" : "translate-x-0"}`}
          />
        </button>
      </div>

      {/* Reorder Reminders */}
      <div className="flex items-center justify-between">
        <span className="text-[14px] text-[#0A2A43]">Reorder Reminders</span>
        <button
          onClick={() => setReorder(!reorder)}
          className={`w-[48px] h-[26px] rounded-full p-[3px] transition-all duration-300
            ${reorder ? "bg-[#2E6CF6]" : "bg-[#D1D5DB]"}`}
        >
          <div
            className={`w-[20px] h-[20px] bg-white rounded-full shadow-md transition-all duration-300
              ${reorder ? "translate-x-[22px]" : "translate-x-0"}`}
          />
        </button>
      </div>
    </div>
             <div className="w-[50%] flex flex-col gap-[16px] rounded-[36px] p-[16px] border border-[#B3BDC5]">
      <span className="font-semibold text-[14px] leading-[26px] text-[#0A2A43]">
        Device Notifications
      </span>

      {/* Low Stock Alerts */}
      <div className="flex items-center justify-between">
        <span className="text-[14px] text-[#0A2A43]">Device Offline Alerts</span>
        <button
          onClick={() => setoffline(!offline)}
          className={`w-[48px] h-[26px] rounded-full p-[3px] transition-all duration-300
            ${offline ? "bg-[#2E6CF6]" : "bg-[#D1D5DB]"}`}
        >
          <div
            className={`w-[20px] h-[20px] bg-white rounded-full shadow-md transition-all duration-300
              ${offline ? "translate-x-[22px]" : "translate-x-0"}`}
          />
        </button>
      </div>

      {/* Critical Alerts */}
      <div className="flex items-center justify-between">
        <span className="text-[14px] text-[#0A2A43]">Device Health</span>
        <button
          onClick={() => setHealth(!health)}
          className={`w-[48px] h-[26px] rounded-full p-[3px] transition-all duration-300
            ${health ? "bg-[#2E6CF6]" : "bg-[#D1D5DB]"}`}
        >
          <div
            className={`w-[20px] h-[20px] bg-white rounded-full shadow-md transition-all duration-300
              ${health ? "translate-x-[22px]" : "translate-x-0"}`}
          />
        </button>
      </div>

      {/* Reorder Reminders */}
      <div className="flex items-center justify-between">
        <span className="text-[14px] text-[#0A2A43]">Battery Status Alerts</span>
        <button
          onClick={() => setBattery(!battery)}
          className={`w-[48px] h-[26px] rounded-full p-[3px] transition-all duration-300
            ${battery ? "bg-[#2E6CF6]" : "bg-[#D1D5DB]"}`}
        >
          <div
            className={`w-[20px] h-[20px] bg-white rounded-full shadow-md transition-all duration-300
              ${battery ? "translate-x-[22px]" : "translate-x-0"}`}
          />
        </button>
      </div>
    </div>
            </div>
            <div className="flex flex-col gap-[16px] rounded-[36px] p-[16px] border border-[#B3BDC5]">
              <div className="flex items-center justify-between">
        <span className="text-[14px] text-[#0A2A43]">Order Status Updates (Placed / In Transit / Delivered)</span>
        <button
          onClick={() => setupdate(!update)}
          className={`w-[48px] h-[26px] rounded-full p-[3px] transition-all duration-300
            ${update? "bg-[#2E6CF6]" : "bg-[#D1D5DB]"}`}
        >
          <div
            className={`w-[20px] h-[20px] bg-white rounded-full shadow-md transition-all duration-300
              ${update ? "translate-x-[22px]" : "translate-x-0"}`}
          />
        </button>
      </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Settings;