import React from 'react'
import closeicon from '../../../assets/Dashboard/Inventory/close.png';

const Notification = ({ onClose }) => {
  return (
    <div className='flex flex-col rounded-[30px] p-[20px] gap-[20px] h-full bg-white border border-[#8A939B] overflow-hidden'>
      <div className='flex flex-col p-[20px] gap-[16px] overflow-y-auto settings-scroll'>
        <div className='flex justify-between pr-[8px]'>
          <h2 className='font-semibold text-[20px] leading-[32px] text-[#0A2A43]'>
            Unread
          </h2>
          <img onClick={onClose} src={closeicon} className='w-[20px] h-[20px]'/>
        </div>
        <div className='flex flex-col gap-[8px]'>
            <div className='rounded-[80px] px-[24px] py-[12px] bg-[#F2FAFF] border border-[#8A939B]'>
              <div className='flex justify-between'>
                <h2 className='font-semibold text-[12px] leading-[24px] text-[#0A2A43]'>
                  Weight Drop Alert (Device)
                </h2>
                <p className='text-[12px] font-semibold leading-[24px] text-[#8A939B]'>
                  Time: 10:41 AM
                </p>
              </div>
              <h2 className='font-semibold text-[12px] leading-[24px] text-[#0A2A43]'>
                "Your device detected a 1.2 kg drop."
              </h2>
            </div>
            <div className='rounded-[80px] px-[24px] py-[12px] bg-[#F2FAFF] border border-[#8A939B]'>
              <div className='flex justify-between'>
                <h2 className='font-semibold text-[12px] leading-[24px] text-[#0A2A43]'>
                  Weight Drop Alert (Device)
                </h2>
                <p className='text-[12px] font-semibold leading-[24px] text-[#8A939B]'>
                  Time: 10:41 AM
                </p>
              </div>
              <h2 className='font-semibold text-[12px] leading-[24px] text-[#0A2A43]'>
                "Your device detected a 1.2 kg drop."
              </h2>
            </div>
        </div>
        <div className='flex justify-between pr-[8px]'>
          <h2 className='font-semibold text-[20px] leading-[32px] text-[#0A2A43]'>
            Today
          </h2>
        </div>
        <div className='flex flex-col gap-[8px]'>
            <div className='rounded-[80px] px-[24px] py-[12px] bg-[#F4F6F8] border border-[#8A939B]'>
              <div className='flex justify-between'>
                <h2 className='font-semibold text-[12px] leading-[24px] text-[#0A2A43]'>
                  Weight Drop Alert (Device)
                </h2>
                <p className='text-[12px] font-semibold leading-[24px] text-[#8A939B]'>
                  Time: 10:41 AM
                </p>
              </div>
              <h2 className='font-semibold text-[12px] leading-[24px] text-[#0A2A43]'>
                Your device detected a 1.2 kg drop.
              </h2>
            </div>
            <div className='rounded-[80px] px-[24px] py-[12px] bg-[#F4F6F8] border border-[#8A939B]'>
              <div className='flex justify-between'>
                <h2 className='font-semibold text-[12px] leading-[24px] text-[#0A2A43]'>
                  Sync Completed
                </h2>
                <p className='text-[12px] font-semibold leading-[24px] text-[#8A939B]'>
                  Time: 10:41 AM
                </p>
              </div>
              <h2 className='font-semibold text-[12px] leading-[24px] text-[#0A2A43]'>
                Auto-sync completed successfully
              </h2>
            </div>
            <div className='rounded-[80px] px-[24px] py-[12px] bg-[#F4F6F8] border border-[#8A939B]'>
              <div className='flex justify-between'>
                <h2 className='font-semibold text-[12px] leading-[24px] text-[#0A2A43]'>
                  Activity Normal
                </h2>
                <p className='text-[12px] font-semibold leading-[24px] text-[#8A939B]'>
                  Time: 08:22 AM
                </p>
              </div>
              <h2 className='font-semibold text-[12px] leading-[24px] text-[#0A2A43]'>
                Routine usage detected - no issues.
              </h2>
            </div>
        </div>
        <div className='flex justify-between pr-[8px]'>
          <h2 className='font-semibold text-[20px] leading-[32px] text-[#0A2A43]'>
            Yesterday
          </h2>
        </div>
        <div className='flex flex-col gap-[8px]'>
            <div className='rounded-[80px] px-[24px] py-[12px] bg-[#F4F6F8] border border-[#8A939B]'>
              <div className='flex justify-between'>
                <h2 className='font-semibold text-[12px] leading-[24px] text-[#0A2A43]'>
                  Battery Low Alert
                </h2>
                <p className='text-[12px] font-semibold leading-[24px] text-[#8A939B]'>
                  Time: 06:10 PM
                </p>
              </div>
              <h2 className='font-semibold text-[12px] leading-[24px] text-[#0A2A43]'>
                Device battery reached 15%.
              </h2>
            </div>
            <div className='rounded-[80px] px-[24px] py-[12px] bg-[#F4F6F8] border border-[#8A939B]'>
              <div className='flex justify-between'>
                <h2 className='font-semibold text-[12px] leading-[24px] text-[#0A2A43]'>
                  Firmware Updated
                </h2>
                <p className='text-[12px] font-semibold leading-[24px] text-[#8A939B]'>
                  Time: 04:25 PM
                </p>
              </div>
              <h2 className='font-semibold text-[12px] leading-[24px] text-[#0A2A43]'>
                Your device firmware was successfully updated.
              </h2>
            </div>
        </div>
        <div className='flex justify-between pr-[8px]'>
          <h2 className='font-semibold text-[20px] leading-[32px] text-[#0A2A43]'>
            Older Notifications
          </h2>
        </div>
        <div className='flex flex-col gap-[8px]'>
            <div className='rounded-[80px] px-[24px] py-[12px] bg-[#F4F6F8] border border-[#8A939B]'>
              <div className='flex justify-between'>
                <h2 className='font-semibold text-[12px] leading-[24px] text-[#0A2A43]'>
                  Reminder
                </h2>
                <p className='text-[12px] font-semibold leading-[24px] text-[#8A939B]'>
                  Date: 25 Nov, 4:30 PM
                </p>
              </div>
              <h2 className='font-semibold text-[12px] leading-[24px] text-[#0A2A43]'>
                Time to check device status.
              </h2>
            </div>
            <div className='rounded-[80px] px-[24px] py-[12px] bg-[#F4F6F8] border border-[#8A939B]'>
              <div className='flex justify-between'>
                <h2 className='font-semibold text-[12px] leading-[24px] text-[#0A2A43]'>
                  Usage Pattern Detected
                </h2>
                <p className='text-[12px] font-semibold leading-[24px] text-[#8A939B]'>
                  Date: 24 Nov, 6:00 AM
                </p>
              </div>
              <h2 className='font-semibold text-[12px] leading-[24px] text-[#0A2A43]'>
                Higher than normal consumption today.
              </h2>
            </div>
          </div>
      </div>
    </div>
  )
}

export default Notification