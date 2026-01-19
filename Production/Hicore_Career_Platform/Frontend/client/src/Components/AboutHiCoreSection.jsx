import React from "react";
// Image imports remain unchanged
import HandImage from "../assets/hand-laptop.png";
import StudentImg from "../assets/student.png";
import JobSeekerImg from "../assets/Job seeker.png";
import MentorImg from "../assets/Mentor.png";
import EmployerImg from "../assets/Employer.png";
import starIcon from "../assets/aistars.png";

const AboutHiCoreSection = () => {
  // Data for the help items and features is the same
  const helpItems = [
    {
      title: "Students:",
      desc: "Learn industry-level skills, build portfolio projects, get mentored, land internships and jobs.",
      img: StudentImg,
    },
    {
      title: "Jobseekers:",
      desc: "Connect with top clients and roles that match your expertise — full-time, part-time, or freelance.",
      img: JobSeekerImg,
    },
    {
      title: "Mentors:",
      desc: "Share your knowledge, guide learners, and get paid for your expertise.",
      img: MentorImg,
    },
    {
      title: "Employers:",
      desc: "Recruit job-ready talent proven through real projects — not just polished resumes.",
      img: EmployerImg,
    },
  ];

  const features = [
    "Learn by building — not just watching videos",
    "AI-powered career guidance & skill evaluation",
    "Strong community of mentors, peers, and hiring partners",
    "Global career exposure (US, Canada, Remote)",
  ];

  return (
    <section id="about-us" className="relative z-20 px-4 sm:px-6">
      {/* Grey background behind top portion */}
      <div className="absolute top-0 left-0 w-full h-[200px] " />

      {/* White curved box */}
      <div className="max-w-7xl mx-auto mt-10 mb-10">
        <div className="bg-white rounded-3xl shadow-[0_12px_28px_rgba(0,0,0,0.25)] p-6 sm:p-8 md:p-10 flex flex-col gap-10">
          {/* Header Section */}
          <div className="text-center">
            {/* The h2 now uses w-full for mobile and a fixed width only on medium screens and up */}
            <h2 className="w-full font-poppins font-bold text-[28px] leading-[32px] text-center mb-2 text-[#343079] mx-auto md:w-[535px] md:h-[32px]">
              About HiCore Career Project Platform
            </h2>
            <div className="flex justify-center items-center mb-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#343079] rotate-45" />
                {/* The divider line is hidden on mobile and shown on small screens and up */}
                <div className="w-[540px] h-0 border-t-[1.5px] border-[#343079] hidden sm:block" />
                <div className="w-2 h-2 bg-[#343079] rotate-45" />
              </div>
            </div>
            {/* The paragraph uses w-full for mobile and a max-w on medium screens */}
            <p className="w-full mx-auto text-center font-poppins font-normal text-base leading-[32px] text-[#343079] md:max-w-[900px]">
              HiCore Career Project Platform empowers you to build real-world
              projects, gain certifications, connect with mentors, and launch
              your dream career{" "}
              <span className="text-[#343079] font-poppins font-semibold">
                — all in one place.
              </span>
            </p>
          </div>

          {/* "Who We Help" Section */}
          <div className="px-4 sm:px-6 md:px-10 w-full md:max-w-[1040px] mx-auto">
            {/* The h3 now uses w-full for mobile and a fixed width on medium screens and up */}
            <h3 className="w-full font-poppins font-bold text-[24px] leading-[32px] text-[#343079] mb-6 md:w-[1040px] md:h-[32px]">
              Who We Help
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {helpItems.map(({ title, desc, img }, index) => (
                <div
                  key={index}
                  // The card now uses w-full for mobile instead of a fixed width
                  className="w-full cursor-default bg-[#F3F3FB] border border-[#65629E] rounded-lg p-9 flex flex-col gap-4 transition-all duration-300 ease-linear hover:shadow-[0px_4px_4px_0px_#00000040]"
                >
                  <img
                    src={img}
                    alt={title}
                    className="w-12 h-12 object-contain"
                  />
                  {/* The title and description text inside the cards are now w-full */}
                  <h4 className="w-full font-poppins font-bold text-[16px] leading-[32px] text-[#343079]">
                    {title}
                  </h4>
                  <p className="w-full font-poppins font-normal text-[16px] leading-[32px] text-[#343079]">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* "Why We're Different" Section */}
          <div className="flex flex-col lg:flex-row items-center gap-8 px-4 sm:px-6 md:px-10 w-full md:max-w-[1040px] mx-auto">
            <div className="w-full lg:w-1/2 my-6">
              <img
                src={HandImage}
                alt="Handshake through laptop"
                className="w-full max-w-xl mx-auto lg:mx-0"
              />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              {/* The h3 now uses w-full for mobile and a fixed width on medium screens and up */}
              <h3 className="w-full font-poppins font-bold text-[24px] leading-[32px] text-center text-[#343079] mb-4 md:w-[422px] md:h-[32px]">
                Why We're Different
              </h3>
              {/* The ul uses pl-0 on mobile and pl-16 on small screens and up */}
              <ul className="w-full space-y-3 pl-0 sm:pl-16">
                {features.map((feature, index) => (
                  <li key={index} className="w-full flex gap-2 items-start">
                    <img
                      src={starIcon}
                      alt="star"
                      className="w-[24px] h-[24px] flex-shrink-0"
                    />
                    <span className="font-poppins font-normal text-[16px] leading-[24px] text-[#343079]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHiCoreSection;
