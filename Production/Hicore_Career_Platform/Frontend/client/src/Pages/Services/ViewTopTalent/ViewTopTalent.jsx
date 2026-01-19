import React from "react";
import { useNavigate } from "react-router-dom";
import topTalentImage from "../../../assets/Toptalent/bg-inner-image.png";
import bgImage from "../../../assets/Toptalent/bg-image.jpg";

// Banner Images
import bannerBg from "../../../assets/Toptalent/bottom-bg.jpg"; // your banner background image
import bannerInner from "../../../assets/Toptalent/bottom-bg-inner.png"; // your inner hand/magnifier image

// Icons
import hireIcon from "../../../assets/Toptalent/Flash.png";
import matchIcon from "../../../assets/Toptalent/AITools.png";
import engageIcon from "../../../assets/Toptalent/Aboutus.png";
import saveIcon from "../../../assets/Toptalent/Target.png";

// Step Icons
import step1Icon from "../../../assets/Toptalent/Editprofile.png";
import step2Icon from "../../../assets/Toptalent/Explore.png";
import step3Icon from "../../../assets/Toptalent/Answer.png";
import step4Icon from "../../../assets/Toptalent/Submit.png";

// New Images
import urgentHiringImg from "../../../assets/Toptalent/image-one.jpg";
import nicheRolesImg from "../../../assets/Toptalent/image-two.jpg";
import bulkHiringImg from "../../../assets/Toptalent/image-three.jpg";
import passiveSearchImg from "../../../assets/Toptalent/image-four.jpg";

const ViewTopTalent = () => {

  const navigate = useNavigate(); // <-- Hook to navigate

  const goToBrowseTopTalent = () => {
    navigate("/browse-top-talent");
  };

  return (
    <div>
      {/* Top Section */}
      <div
        className="w-full flex justify-center items-center py-6 px-6 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <div className="max-w-8xl p-10 w-full flex flex-col md:flex-row items-center gap-10">
          {/* Left Section */}
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-[#2b2b5f] mb-4">
              Discover the Best Talent in Minutes
            </h2>
            <p className="text-[#2b2b5f] mb-10 leading-relaxed">
              We handpick and recommend only the most qualified candidates,
              already reviewed for skills and experience, so you get people who
              are a perfect fit for your job — and you can reach out to them
              right away.
            </p>
            <button
              onClick={goToBrowseTopTalent} // <-- Button click
              className="bg-[#2b2b5f] cursor-pointer text-white w-full py-3 rounded-md transition-all duration-300 hover:border-white hover:bg-gradient-to-r hover:from-[#403B93] hover:to-[#8682D3]"
            >
              Start Browsing Top Talent
            </button>
          </div>

          {/* Right Section - Inside Image */}
          <div className="flex-1 flex justify-center">
            <img
              src={topTalentImage}
              alt="Top Talent"
              className="rounded-lg shadow-md w-full-lg"
            />
          </div>
        </div>
      </div>

      {/* Why Use This Service Section */}
      <div className="max-w-8xl m-10 border border-gray-200 rounded-md p-10 py-12">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#2b2b5f] mb-10">
          Why Use This Service
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Card 1 */}
          <div className="bg-[#f2f3ff] rounded-lg p-6 border border-blue-900 flex flex-col items-start text-start gap-4">
            <img src={hireIcon} alt="Hire Faster" className="w-12 h-12" />
            <h3 className="font-bold text-[#2b2b5f]">Hire Faster</h3>
            <p className="text-[#2b2b5f] text-md">
              Find candidates with the right skills instantly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#fff8e7] rounded-lg p-6 border border-blue-900 flex flex-col items-start text-start gap-4">
            <img src={matchIcon} alt="Better Matches" className="w-12 h-12" />
            <h3 className="font-bold text-[#2b2b5f]">Better Matches</h3>
            <p className="text-[#2b2b5f] text-md">
              AI match scores help you shortlist with confidence.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#eef6ff] rounded-lg p-6 border border-blue-900 flex flex-col items-start text-start gap-4">
            <img
              src={engageIcon}
              alt="Engage Instantly"
              className="w-12 h-12"
            />
            <h3 className="font-bold text-[#2b2b5f]">Engage Instantly</h3>
            <p className="text-[#2b2b5f] text-md">
              Message or invite top matches directly.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#eaffea] rounded-lg p-6 border border-blue-900 flex flex-col items-start text-start gap-4">
            <img src={saveIcon} alt="Save Time & Costs" className="w-12 h-12" />
            <h3 className="font-bold text-[#2b2b5f]">Save Time & Costs</h3>
            <p className="text-[#2b2b5f] text-md">
              Skip manual searches and irrelevant profiles.
            </p>
          </div>
        </div>
      </div>

      {/* Uses of the Service Section */}
      <div className="max-w-8xl m-10 border border-gray-200 rounded-md p-10 py-12">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#2b2b5f] mb-10">
          Uses of the Service
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10">
          {/* Urgent Hiring */}
          <div className="rounded-lg border border-gray-300 overflow-hidden shadow-sm">
            <img
              src={urgentHiringImg}
              alt="Urgent Hiring"
              className="w-full h-84 object-cover object-contain"
            />
            <div className="p-6 bg-[#fff8f0]">
              <h3 className=" text-xl font-semibold text-[#2b2b5f] mb-3 mt-4">
                Urgent Hiring
              </h3>
              <p className="text-[#2b2b5f] text-md">
                When you need someone on board immediately, our platform
                connects you with top candidates who are actively looking and
                ready to start. No long screening process – just direct access
                to pre-vetted talent so you can hire in days, not weeks.
              </p>
            </div>
          </div>

          {/* Niche Roles */}
          <div className="rounded-lg border border-gray-300 overflow-hidden shadow-sm">
            <img
              src={nicheRolesImg}
              alt="Niche Roles"
              className="w-full h-84 object-cover object-contain"
            />
            <div className="p-6 bg-[#fff8f0]">
              <h3 className="text-xl font-semibold text-[#2b2b5f] mb-3 mt-4">
                Niche Roles
              </h3>
              <p className="text-[#2b2b5f] text-md">
                Whether it’s a rare programming language, a niche industry role,
                or a highly specific certification, we surface candidates who
                meet those exact requirements. You won’t waste time sorting
                through irrelevant profiles - we bring the perfect match to you.
              </p>
            </div>
          </div>

          {/* Bulk Hiring */}
          <div className="rounded-lg border border-gray-300 overflow-hidden shadow-sm">
            <img
              src={bulkHiringImg}
              alt="Bulk Hiring"
              className="w-full h-84 object-cover object-contain"
            />
            <div className="p-6 bg-[#fff8f0]">
              <h3 className="text-xl font-semibold text-[#2b2b5f] mb-3 mt-4">
                Bulk Hiring
              </h3>
              <p className="text-[#2b2b5f] text-md">
                Hiring for multiple openings or expanding a team? Easily
                identify and shortlist several qualified professionals at once,
                so you can manage high-volume recruitment with less effort and
                more efficiency.
              </p>
            </div>
          </div>

          {/* Passive Search */}
          <div className="rounded-lg border border-gray-300 overflow-hidden shadow-sm">
            <img
              src={passiveSearchImg}
              alt="Passive Search"
              className="w-full h-84 object-cover object-contain"
            />
            <div className="p-6 bg-[#fff8f0]">
              <h3 className="text-xl font-semibold text-[#2b2b5f] mb-3 mt-4">
                Passive Search
              </h3>
              <p className="text-[#2b2b5f] text-md">
                Even if you’re not hiring today, you can save and track
                high-potential candidates for future opportunities. This means
                when a role opens up, you already have a ready-to-contact list
                of proven talent.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-8xl m-10 border border-gray-200 rounded-md p-12 py-12">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#2b2b5f] mb-10">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-15">
          {/* Step 1 */}
          <div className="bg-[#fff9f2] rounded-lg p-6 md:w-full relative flex flex-col items-start text-start">
            <img
              src={step1Icon}
              alt="Set Requirements"
              className="w-8 h-8 mb-4"
            />
            <div className="absolute top-0 -right-9 bg-[#4631A1] text-white text-sm px-4 py-1 rounded">
              Step 1
            </div>
            <h3 className="font-bold text-[#2b2b5f] mb-2">
              Set Your Requirements
            </h3>
            <p className="text-[#2b2b5f] text-sm">
              Choose role, skills, location, and experience.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#fff9f2] rounded-lg p-6 md:w-full relative flex flex-col items-start text-start">
            <img
              src={step2Icon}
              alt="AI Finds Matches"
              className="w-8 h-8 mb-4"
            />
            <div className="absolute top-0 -right-9 bg-[#4631A1] text-white text-sm px-4 py-1 rounded">
              Step 2
            </div>
            <h3 className="font-bold text-[#2b2b5f] mb-2">AI Finds Matches</h3>
            <p className="text-[#2b2b5f] text-sm">
              Our system scans the database for the best candidates.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#fff9f2] rounded-lg p-6 md:w-full relative flex flex-col items-start text-start">
            <img
              src={step3Icon}
              alt="View & Compare"
              className="w-8 h-8 mb-4"
            />
            <div className="absolute top-0 -right-9 bg-[#4631A1] text-white text-sm px-4 py-1 rounded">
              Step 3
            </div>
            <h3 className="font-bold text-[#2b2b5f] mb-2">
              View & Compare Profiles
            </h3>
            <p className="text-[#2b2b5f] text-sm">
              See detailed skills, experience, and match score.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-[#fff9f2] rounded-lg p-6 md:w-full relative flex flex-col items-start text-start">
            <img
              src={step4Icon}
              alt="Connect & Hire"
              className="w-8 h-8 mb-4"
            />
            <div className="absolute top-0 -right-9 bg-[#4631A1] text-white text-sm px-4 py-1 rounded">
              Step 4
            </div>
            <h3 className="font-bold text-[#2b2b5f] mb-2">Connect & Hire</h3>
            <p className="text-[#2b2b5f] text-sm">
              Message, invite, or shortlist instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Banner CTA Section */}
      <div className="bg-white h-110 m-10 border border-gray-200 p-10 rounded-md">
        <div
          className="w-full h-90 rounded-lg overflow-hidden"
          style={{
            backgroundImage: `url(${bannerBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col md:flex-row items-center px-20 py-8 md:py-12">
            {/* Left Side */}
            <div className="text-white md:w-[45%]">
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-[#2b2b5f]">
                Ready to Find Your Next Great Hire?
              </h2>
              <p className="mb-8   text-[#2b2b5f]">
                Join thousands of recruiters who trust our AI-powered talent
                search.
              </p>
              <button
                onClick={goToBrowseTopTalent} // <-- Button click
                className="bg-[#2b2b5f] hover:bg-[#1e1e3f] w-full cursor-pointer text-white px-5 py-2 rounded-md transition-all duration-300 hover:border-white hover:bg-gradient-to-r hover:from-[#403B93] hover:to-[#8682D3]"
              >
                Browse Top Talent Now
              </button>
            </div>

            {/* Right Side */}
            <div className="md:w-[55%] flex justify-end mt-6 md:mt-0">
              <img
                src={bannerInner}
                alt="Talent Search"
                className="h-72 md:h-80 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTopTalent;
