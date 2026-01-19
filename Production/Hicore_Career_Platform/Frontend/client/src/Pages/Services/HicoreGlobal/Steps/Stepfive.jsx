import React from "react";
import img1 from "../../../../assets/HicoreGlobal/calendar.png";
import img2 from "../../../../assets/HicoreGlobal/book.png";
import img3 from "../../../../assets/HicoreGlobal/woman.png";
import footerbg from "../../../../assets/HicoreGlobal/footer_bg.png";
import footerimg from "../../../../assets/HicoreGlobal/formfilling.png";

const testPrepData = [
  {
    title: "Study Plan Creation",
    description:
      "Assess current level, identify weak areas, create personalized study schedule",
    button: "Download Study Plan Template",
    image: img1,
  },
  {
    title: "Content Review",
    description:
      "Systematic review of all test sections with practice questions",
    button: "Access Practice Tests",
    image: img2,
  },
  {
    title: "Mock Tests",
    description: "Full-length practice tests under real exam conditions",
    button: "Schedule Mock Test",
    image: img3,
  },
];

const Stepfive = ({onContinue}) => {
  return (
    <div className="w-full h-fit p-9 border-t border-r border-b border-[#C0BFD5] rounded-tr-[8px] rounded-br-[8px] flex flex-col gap-6">
      {/* Heading */}
      <div className="w-full flex flex-col gap-2">
        <h2 className="text-[20px] font-semibold leading-[36px] text-[#343079]">
          Step 5 : Test Preparation
        </h2>
        <div className="bg-[#FFE4FF] px-4 py-2 rounded-[8px] w-fit">
          <p className="text-[16px] font-medium text-[#343079] leading-[28px]">
            Prepare for required standardized tests
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="w-full flex flex-wrap gap-[24px]">
        {testPrepData.map((item, index) => (
          <div
            key={index}
            className="w-full md:w-[48%] lg:w-[calc(33.333%-16px)] min-h-[400px] border border-[#C0BFD5] rounded-[8px] flex flex-col overflow-hidden"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-[200px] object-cover rounded-t-[8px]"
            />

            {/* Text + Button */}
            <div className="flex flex-col flex-grow p-6">
              {/* Title & Desc */}
              <div>
                <h2 className="text-[20px] font-semibold text-[#343079] leading-[36px]">
                  {item.title}
                </h2>
                <p className="text-[16px] font-normal mt-4 text-[#343079] leading-[32px]">
                  {item.description}
                </p>
              </div>

            </div>              
              {/* Button */}
              <button className="w-full h-[44px] bg-[#282655] text-white rounded-[8px] text-[16px] font-medium leading-[28px] hover:border hover:border-[#403B93]">
                {item.button}
              </button>

          </div>
        ))}
        <div className="w-full p-[36px] h-fit rounded-lg border border-[#EBEAF2]">
          <div className="w-full h-full min-h-[420px] p-[36px] rounded-[8px] bg-cover bg-no-repeat bg-center rounded-[8px] flex flex-col sm:flex-row px-[24px] sm:px-[64px] py-[24px] sm:py-[36px] gap-[24px] sm:gap-[36px]"
           style={{ backgroundImage: `url(${footerbg})` }}>
            <div className="w-full inline-flex flex-col gap-[36px] opacity-100">
                <div className="w-full flex flex-col gap-[36px] opacity-100">
                    <div className="w-full flex flex-col lg:flex-row gap-[36px]">
                        {/* Left Side */}
                        <div className="w-full lg:w-1/2 rounded-[8px] flex flex-col gap-[36px]">
                        {/* Heading */}
                        <h3 className="text-[#343079] font-poppins font-semibold text-[20px] leading-[48px]">
                            Test Registration
                        </h3>
                        {/* Paragraph */}
                        <p className="text-[#343079] font-poppins font-normal text-[18px] leading-[36px]">
                            Register for official test dates at least 6 weeks before application deadlines
                        </p>

                        {/* Button: GRE */}
                        <button className="w-full h-[44px] px-[24px] py-[8px] rounded-[8px] border border-[#282655] bg-[#282655] text-white text-base font-medium transition-all duration-300 hover:border-[#403B93]">
                             Register for GRE
                        </button>

                        {/* Button: TOEFL */}
                        <button className="w-full h-[44px] px-[24px] py-[8px] rounded-[8px] border border-[#282655] bg-[#282655] text-white text-base font-medium transition-all duration-300 hover:border-[#403B93]">
                        Register for TOEFL
                        </button>
                    </div>

                {/* Right Side (Image Centered) */}
                <div className="w-full lg:w-1/2 rounded-[8px] flex flex-col gap-[36px]">
                 <img
                  src={footerimg}
                  alt="Test Registration"
                  className="w-full h-[300px] mt-13 object-contain"
                 />
               </div>
            </div>
         </div>
         </div>
         </div>

         </div>                 
         {/* Continue Button */}
        <div className="w-full flex justify-end">
          <button onClick={onContinue}
           className="bg-[#282655] mt-4 text-white px-6 py-2 rounded-[8px] hover:bg-[#403B93] border hover:border-white">
             Prepare Documents
          </button>
        </div>

        </div>
    </div>
  );
};

export default Stepfive;
