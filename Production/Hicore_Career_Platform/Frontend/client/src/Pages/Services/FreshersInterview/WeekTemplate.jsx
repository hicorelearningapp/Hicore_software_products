import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import banner from "../../../assets/FreshersInterview/InterviewBanner.png";
import arrowIcon from "../../../assets/FreshersInterview/doublearrow.png";
import backArrow from "../../../assets/FreshersInterview/back.png";

const WeekTemplate = () => {
  const { weekId } = useParams();
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE || "/api";

  const [allWeekData, setAllWeekData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE}/freshers/weeks`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAllWeekData(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE]);

  const data = allWeekData ? allWeekData[weekId] : null;

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10">Error: {error}</div>;
  }

  if (!data) {
    return <div className="text-center mt-10">Invalid Week</div>;
  }

  return (
    <div className="w-full h-auto opacity-100">
      {/* Top Banner Section */}
      <div
        className="w-full h-auto px-[20px] sm:px-[64px] py-[36px] bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${banner})` }}
        
      >
        <div className="w-full max-w-[1312px] h-auto mx-auto flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Left Side */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <button
              onClick={() => navigate("/fresher-interview-success-program")}
              className="w-fit flex items-center gap-2 cursor-pointer px-2 py-1"
            >
              <img src={backArrow} alt="Back" className="w-5 h-5" />
              <span className="text-[#343079] font-poppins font-medium">
                Back
              </span>
            </button>

            <h2 className="text-[#343079] font-poppins font-bold text-[24px] leading-[32px] md:text-[32px] md:leading-[48px] px-4 py-2">
              {data.heading}
            </h2>

            <h3 className="text-[#343079] font-poppins font-semibold text-[20px] leading-[28px] md:leading-[36px] px-4 py-2">
              {data.subheading}
            </h3>

            <p className="text-[#343079] font-poppins text-[16px] leading-[32px] px-4 py-2">
              {data.paragraph}
            </p>

            <div className="w-full flex justify-between items-center px-2 md:px-0">
              {data.previousWeek && allWeekData[data.previousWeek] && (
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/fresher-interview-success-program/${data.previousWeek}`
                    )
                  }
                >
                  <img
                    src={arrowIcon}
                    alt="Prev"
                    className="w-6 h-6 rotate-180"
                  />
                  <span className="text-[#343079] font-poppins text-[16px]">
                    {allWeekData[data.previousWeek].weekName}
                  </span>
                </div>
              )}

              {data.nextWeek && allWeekData[data.nextWeek] && (
                <div
                  className="flex items-center gap-2 cursor-pointer ml-auto"
                  onClick={() =>
                    navigate(
                      `/fresher-interview-success-program/${data.nextWeek}`
                    )
                  }
                >
                  <span className="text-[#343079] font-poppins text-[16px]">
                    {allWeekData[data.nextWeek].weekName}
                  </span>
                  <img src={arrowIcon} alt="Next" className="w-6 h-6" />
                </div>
              )}
            </div>
          </div>

          {/* Right Side Image */}
          <div className="w-full md:w-[398.82px] h-auto rounded-[8px] mr-14 mt-8">
            {data.banner && (
              <img
                src={`${API_BASE}/uploads${data.banner}`}
                alt="Week Banner"
                className="w-full md:w-[398.82px] md:h-[265.81px] object-cover rounded-[8px]"
              />
            )}
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="w-full px-2 py-8 md:px-[40px] md:py-[80px] mx-auto">
        <div className="w-full max-w-[1240px] mx-auto border border-[#E1E0EB] rounded-[16px] p-6 md:p-[36px]">
          <h2 className="text-[36px] leading-[48px] text-center font-poppins text-[#343079] mb-12">
            Explore Topics
          </h2>

          <div className="w-full max-w-[1168px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[36px] mx-auto">
            {data.cards.map((card, index) => (
              <div
                key={index}
                onClick={() =>
                  navigate(
                    `/fresher-interview-success-program/${weekId}/${card.topicId}`
                  )
                }
                className="w-full h-auto cursor-pointer p-[36px] rounded-[8px] border"
                style={{
                  backgroundColor: card.bgColor,
                  borderColor: "#65629E",
                }}
              >
                {card.icon && (
                 <img
  src={encodeURI(`${API_BASE}/uploads${card.icon}`)}
  alt="icon"
  className="w-[48px] h-[48px] mb-4"
/>

                )}
                <h3 className="font-bold text-[16px] leading-[32px] text-[#343079] mb-2 font-poppins">
                  {card.title}
                </h3>
                <p className="w-[275px] text-[16px] leading-[32px] text-[#343079] font-poppins">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekTemplate;
