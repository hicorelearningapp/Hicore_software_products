import React from "react";
import capsuleimg from "../assets/Home/capsule.png";
import alloImg from "../assets/Home/allopathy.png";
import homeoImg from "../assets/Home/homeopathy.png";
import ayurImg from "../assets/Home/ayurvedic.png";
import unaniImg from "../assets/Home/unani.png";
import herbalImg from "../assets/Home/herbal.png";
import suppleImg from "../assets/Home/supplements.png";
import counterImg from "../assets/Home/over-the-counter.png";

const medicines = [
  { id: 1, name: "Allopathy", img: alloImg },
  { id: 2, name: "Ayurvedic", img: ayurImg },
  { id: 3, name: "Homeopathy", img: homeoImg },
  { id: 4, name: "Unani", img: unaniImg },
  { id: 5, name: "Herbal/Organic", img: herbalImg },
  { id: 6, name: "Supplements", img: suppleImg },
  { id: 7, name: "Over-the-Counter", img: counterImg },
  { id: 8, name: "View All Medicines >>", isViewAll: true },
];

const MedicineCategories = () => {
  return (
    <div className="mt-[64px] flex flex-col items-center justify-center pt-[78px]">

      {/* Top Icon */}
      <img
        src={capsuleimg}
        alt=""
        className="w-[177px] h-[132px] opacity-25 max-md:w-[120px] max-md:h-[90px]"
      />

      {/* Heading */}
      <div className="text-center px-[128px] pb-[64px] max-md:px-6 max-md:pb-6">
        <h2 className="font-semibold text-[28px] leading-[48px] text-[#115D29] max-md:text-[22px] max-md:leading-[32px]">
          Medicine Categories
        </h2>
        <p className="text-[16px] leading-[40px] text-[#115D29] max-md:text-[14px] max-md:leading-[24px]">
          Intelligent technology driving smarter healthcare
        </p>
      </div>

      {/* Cards Grid */}
      <div
        className="
          px-[128px] grid grid-cols-4 gap-[36px] pb-[64px]
          max-md:px-6 max-md:grid-cols-2 max-md:gap-4 max-md:pb-10
        "
      >
        {medicines.map((item) =>
          item.isViewAll ? (
            /* VIEW ALL CARD */
            <div
              key={item.id}
              className="
                group flex items-center justify-center border border-[#115D29]
                text-[#115D29] bg-white rounded-[8px] transition-all duration-300
                hover:bg-[#115D29] hover:text-white
                max-md:h-[140px] max-md:text-[14px]
              "
            >
              <p className="font-semibold text-[16px] py-[60px] text-center max-md:p-0">
                {item.name}
              </p>
            </div>
          ) : (
            /* NORMAL CATEGORY CARD */
            <div
              key={item.id}
              className="
                group h-[294px] rounded-lg border border-[#D7E3DB] overflow-hidden
                transition-all duration-300 hover:bg-[#115D29]
                max-md:h-[200px]
              "
              style={{
                background: "linear-gradient(180deg, #FFFFFF 0%, #DDE7DF 100%)",
              }}
            >
              {/* Image */}
              <div className="flex items-center justify-center pt-[10px] pb-[10px]">
                <img
                  src={item.img}
                  alt=""
                  className="
                    w-fit h-[186px] object-contain
                    max-md:h-[120px]
                  "
                />
              </div>

              {/* Title */}
              <div
                className="
                  h-[108px] flex items-center justify-center px-[16px]
                  text-[#115D29] bg-white rounded-[8px]
                  transition-all duration-300 group-hover:bg-[#115D29] group-hover:text-white
                  max-md:h-[60px] max-md:text-[14px]
                "
              >
                <p className="font-semibold text-[16px] text-center mb-4 max-md:mb-0">
                  {item.name}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MedicineCategories;
