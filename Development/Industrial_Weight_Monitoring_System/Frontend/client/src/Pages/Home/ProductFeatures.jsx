import React from "react";
import featureone from "../../assets/Home/feature-1.jpg";
import featuretwo from "../../assets/Home/feature-2.jpg";
import featurethree from "../../assets/Home/feature-3.jpg";
import featurefour from "../../assets/Home/feature-4.jpg";
import featurefive from "../../assets/Home/feature-5.jpg";

const featuresData = [
  {
    id: 1,
    title: "Real-Time Inventory Dashboard",
    points: [
      "Live stock visibility",
      "Site-wise & SKU-wise tracking",
      "Auto-refreshing IoT data stream",
      "Dark mode support",
    ],
    img: featureone,
  },
  {
    id: 2,
    title: "AI Forecasting & Optimization",
    points: [
      "Predict depletion dates",
      "Suggest optimal reorder quantities",
      "Vendor-wise lead-time optimization",
      "Seasonal trend forecasting",
    ],
    img: featuretwo,
  },
  {
    id: 3,
    title: "Smart Alerts & InVUE Copilot",
    points: [
      "Low-stock & critical alerts",
      "Push notifications, email, SMS",
      `Voice Assistant: "How much stock is left?"`,
      "Trigger orders with voice",
    ],
    img: featurethree,
  },
  {
    id: 4,
    title: "ERP & Vendor Integration",
    points: [
      "REST APIs & Webhooks",
      "Auto-generate purchase orders",
      "Seamless connection with SAP, Zoho, Tally",
      "QR-coded device pairing",
    ],
    img: featurefour,
  },
  {
    id: 5,
    title: "Mobile App (Android & iOS)",
    points: [
      "Live stock levels",
      "Push alerts",
      "One-tap reorders",
      "QR code scanning",
    ],
    img: featurefive,
  },
];

const ProductFeatures = () => {
  return (
    <div id="features" className="flex flex-col gap-[24px] px-[64px] py-[100px] max-md:px-[24px] max-md:py-[60px]">

      {/* Header */}
      <div className="flex flex-col gap-[8px] items-center justify-center text-center px-4">
        <h2 className="font-semibold text-[24px] tracking-[1%] text-[#0A2A43] max-md:text-[20px]">
          PRODUCT FEATURES
        </h2>
        <p className="text-[16px] leading-[28px] tracking-[1%] text-[#8A939B] max-md:text-[15px]">
          Smart features that reduce errors, improve efficiency, and automate decision-making.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="flex flex-col gap-[64px] max-md:gap-[32px]">
        {featuresData.map((item, index) => (
          <div
            key={item.id}
            className={`
              flex items-center justify-between gap-[24px] p-[24px] rounded-[80px]
              border border-[#DBDEE0]
              shadow-[inset_4px_4px_4px_rgba(0,0,0,0.25)] bg-white

              ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}

              /* ⭐ MOBILE: IMAGE ALWAYS BELOW TEXT */
              max-md:flex-col-reverse max-md:rounded-[40px] max-md:p-[20px]
            `}
          >
            {/* Text Section */}
            <div className="
              flex flex-col gap-[12px] w-1/2 px-[16px] items-center justify-center
              max-md:w-full max-md:px-2
            ">
              <h3 className="text-[18px] font-semibold text-[#1D1F22] leading-[30px] max-md:text-[17px]">
                {item.title}
              </h3>

              <ul className="flex flex-col gap-[8px] max-md:gap-[6px]">
                {item.points.map((pt, i) => (
                  <li
                    key={i}
                    className="text-[16px] text-[#8A939B] leading-[28px] flex gap-2 justify-center max-md:justify-start max-md:text-[14px]"
                  >
                    ● {pt}
                  </li>
                ))}
              </ul>
            </div>

            {/* Image Section */}
            <div className="w-1/2 max-md:w-full">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-[220px] object-cover rounded-[80px] p-[8px]
                max-md:h-[200px] max-md:rounded-[30px] max-md:p-[4px]"
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ProductFeatures;
