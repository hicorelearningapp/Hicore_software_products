import React from "react";
import { useNavigate } from "react-router-dom";
import interviewImg from "../../../../assets/Employer/PostJobs/interview.png";
import bannerBg from "../../../../assets/Employer/PostJobs/banner-bg.jpg";
import goalIcon from "../../../../assets/Employer/PostJobs/target.png";
import confidenceIcon from "../../../../assets/Employer/PostJobs/skill.png";
import expertIcon from "../../../../assets/Employer/PostJobs/secure.png";
import calendarIcon from "../../../../assets/Employer/PostJobs/customize.png";
import img1 from "../../../../assets/Employer/PostJobs/img1.jpg";
import img2 from "../../../../assets/Employer/PostJobs/img2.jpg";
import img3 from "../../../../assets/Employer/PostJobs/img3.jpg";
import img4 from "../../../../assets/Employer/PostJobs/img4.jpg";
import finalBannerBg from "../../../../assets/Employer/PostJobs/final-banner-bg.jpg";
import jobIcon from "../../../../assets/Employer/PostJobs/job-icon.png";

const benefits = [
  {
    title: "Quick & Guided Posting",
    desc: "Smart step-by-step form makes job creation easy.|Real-time preview of your listing before publishing.|Auto-save as draft, so you never lose progress.",
    img: img1,
  },
  {
    title: "Attract Qualified Candidates",
    desc: "Showcase your company & team culture|Add required skills, screening questions, and qualifications|Set application deadlines and manage multiple openings",
    img: img2,
  },
  {
    title: "AI-Powered Assistance",
    desc: "Auto-generate job descriptions and responsibilities|Get real-time salary and skill suggestions based on your role|Smart filters to reduce irrelevant applications",
    img: img3,
  },
  {
    title: "Increased Visibility",
    desc: "Your listing is promoted to relevant talent pools on our platform|Optional promotion boosts available for higher visibility|Integration with career portals and partner platforms.",
    img: img4,
  },
];

const PostJob = () => {
  const navigate = useNavigate();

  // ✅ Login check before navigating to post page
  const handlePostJobClick = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      navigate("/login", { state: { from: "/post-jobs/internships" } });
    } else {
      navigate("/post-jobs/internships");
    }
  };

  return (
    <div className="flex flex-col items-center bg-white">
      {/* ======================= Banner Section ======================= */}
      <div
        className="relative overflow-hidden"
        style={{
          width: "full",
          height: "364px",
          padding: "36px 64px",
          backgroundColor: "#eaf2fb",
        }}
      >
        <img
          src={bannerBg}
          alt="Background Design"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-100 z-0"
        />

        <div className="relative px-[16px] flex flex-col md:flex-row items-center justify-between w-full h-full">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-[#343079] mb-4">
              Attract Top Talent with a Few Simple Steps
            </h2>

            <p className="text-[#343079] text-base md:text-lg mb-4 font-normal">
              Effortlessly post job and internship openings to connect with the
              right candidates - faster, smarter, and easier.
            </p>

            <p className="text-[#343079] text-sm md:text-base mb-6 leading-relaxed font-normal">
              Reach top talent by listing your open roles for free
            </p>

            <button
              onClick={handlePostJobClick}
              className="bg-[#1f1c5c] text-white px-60 py-2 rounded-md font-semibold hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC]"
            >
              Create a Post
            </button>
          </div>

          <div className="md:w-1/2 flex justify-end">
            <img
              src={interviewImg}
              alt="Interview"
              className="rounded-[8px] w-[562px] h-[292px] object-cover opacity-100"
            />
          </div>
        </div>
      </div>

      {/* ======================= Why Use This Feature Section ======================= */}
      <div
        className="mt-10 mx-auto border rounded-[8px] bg-white"
        style={{
          width: "1300px",
          height: "400px",
          padding: "36px",
          opacity: 1,
          border: "1px solid #EBEAF2",
        }}
      >
        <h2 className="text-[#343079] text-2xl font-bold text-center mb-9">
          Why Use This Feature?
        </h2>

        <div className="flex justify-between gap-[36px]">
          {[goalIcon, confidenceIcon, expertIcon, calendarIcon].map(
            (icon, index) => {
              const titles = [
                "Ideal for all hiring needs",
                "Target the right candidates",
                "Streamlined process",
                "Customizable posting experience",
              ];
              const descriptions = [
                "Ideal for full-time, part-time, freelance, or internship.",
                "By adding skills, requirements, and filters.",
                "A process to reduce time and effort in creating a Job post.",
                "Customize for different job types and departments.",
              ];
              const bgColor = ["#F3F3FB", "#FFFAEF", "#F0F7FF", "#E8FFDD"];

              return (
                <div
                  key={index}
                  className={`bg-[${bgColor[index]}] border rounded-[8px] transition-all duration-300 ease-linear hover:-translate-y-1 hover:shadow-[0_8px_16px_-4px_rgba(101,98,158,0.2)]`}
                  style={{
                    width: "297px",
                    height: "260px",
                    padding: "36px",
                    gap: "16px",
                    border: "1px solid #65629E",
                  }}
                >
                  <img src={icon} alt="Icon" className="w-11 h-11 mb-4" />
                  <h3 className="text-[#343079] font-semibold mb-2">
                    {titles[index]}
                  </h3>
                  <p
                    className="text-[#343079]"
                    style={{
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "32px",
                    }}
                  >
                    {descriptions[index]}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* ======================= Benefits Section ======================= */}
      <div className="w-full flex justify-center px-[36px] mt-[72px]">
        <div className="w-[1296px] h-[1460px] border border-[#EBEAF2] rounded-[8px] p-[36px] flex flex-col gap-[36px] bg-white">
          <h2 className="text-[#343079] text-[28px] text-center font-semibold font-poppins leading-[56px] h-[56px] w-[1296px]">
            Key Benefits for Employers & Recruiters
          </h2>

          <div className="flex flex-wrap gap-[36px] w-[1296px] h-[1300px]">
            {benefits.map((item, index) => (
              <div
                key={index}
                className="w-[590px] h-[630px] rounded-[8px] bg-[#FFFAEF] flex flex-col shadow-sm"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-[590px] h-[401px] object-cover rounded-t-[8px]"
                />
                <div className="w-[630px] h-[232px] px-[36px] py-[36px] flex flex-col gap-[16px]">
                  <h3 className="w-[558px] h-[48px] text-[#343079] text-[16px] font-semibold font-poppins leading-[32px]">
                    {item.title}
                  </h3>
                  <ul className="w-[558px] text-[#343079] text-[16px] leading-[32px] font-poppins list-disc pl-5">
                    {item.desc.split("|").map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ======================= Final Banner Section ======================= */}
      <div className="w-full flex justify-center px-[27px] mt-[72px]">
        <div className="w-[1368px] h-auto p-[36px] bg-white border border-[#EBEAF2] rounded-[8px] shadow-md">
          <div
            className="w-full h-[288px] flex items-center justify-between px-[48px] rounded-[8px] bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${finalBannerBg})` }}
          >
            {/* Left Content */}
            <div className="flex flex-col gap-[16px] max-w-[520px] px-[50px]">
              <h2 className="text-[#343079] text-[24px] leading-[32px] font-semibold font-poppins">
                Your perfect candidate is out there - help them find you
              </h2>
              <p className="text-[#343079] text-[16px] leading-[28px] font-medium font-poppins">
                Simplify your hiring process with customizable job listings and
                AI-powered suggestions.
              </p>
              <button
                onClick={handlePostJobClick}
                className="w-full px-[32px] h-[48px] rounded-[8px] bg-[#282655] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] text-white text-[14px] font-medium font-poppins"
              >
                Create a Post
              </button>
            </div>

            {/* Right Image */}
            <div className="w-1/2 flex justify-start items-center pl-[200px]">
              <img
                src={jobIcon}
                alt="Job Icon"
                className="w-[190px] h-[206px]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-[48px]"></div>
    </div>
  );
};

export default PostJob;
