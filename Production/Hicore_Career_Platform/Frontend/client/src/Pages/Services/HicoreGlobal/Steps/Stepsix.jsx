import React from 'react'

const Stepsix = ({onContinue}) => {
  return (
    <div className='w-full h-fit p-9 border-t border-r border-b border-[#C0BFD5] rounded-tr-[8px] rounded-br-[8px] flex flex-col gap-6'>
      {/* Heading */}
      <div className="w-full flex flex-col gap-2">
        <h2 className="text-[20px] font-semibold leading-[36px] text-[#343079]">
          Step 6 : Document Preparation
        </h2>
        <div className="bg-[#FFE4FF] px-4 py-2 rounded-[8px] w-fit">
          <p className="text-[16px] font-medium text-[#343079] leading-[28px]">
            Prepare all required application documents
          </p>
        </div>
      </div>
      <div className="w-full p-[36px] h-fit rounded-lg border border-[#EBEAF2]">
        <div className="flex flex-col gap-[12px] ">
            {[
              "Official Transcripts",
              "Statement of Purpose",
              "Letters of Recommendation",
              "Resume/CV",
              "Financial Documents",
              "Passport Copy",
             ].map((country, i) => (
              <label key={i} className="flex items-center gap-2 text-[16px] text-[#343079]">
                <input
                  type="checkbox"
                  className="w-[16px] h-[16px] border-[1.5px] border-[#343079] rounded relative top-[2.08px] left-[2.08px]"
                />
                {country}
              </label>
            ))}
          </div>
      </div>
        {/* Continue Button */}
        <div className="w-full flex justify-end">
          <button onClick={onContinue}
           className="bg-[#282655] mt-15 text-white px-6 py-2  rounded-[8px] hover:bg-[#403B93] border cursor-pointer transition-all duration-300 hover:bg-[#8682D3] hover:border-white">
             Documents Confirmed
          </button>
        </div>


    </div>
  )
}

export default Stepsix