import React from "react";
import closeIcon from "../../../../assets/DistributorPage/close.png";
import successIcon from "../../../../assets/DistributorPage/successConfetti.png";
import tickIcon from "../../../../assets/DistributorPage/greenTick.png";

export default function AutoPurchaseSuccess({ onClose }) {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-[9999]">

      {/* OUTER CONTAINER WITH EXTRA TOP-RIGHT PADDING */}
      <div
        className="bg-white rounded-lg shadow-lg relative"
        style={{
          width: "459px",
          padding: "34px 28px 20px 20px", // <-- extra top-right space added
          borderRadius: "12px",
        }}
      >
        {/* CLOSE ICON — shifted inward to avoid clipping */}
        <img
          src={closeIcon}
          alt="close"
          className="absolute top-3 right-6 w-5 h-5 cursor-pointer"
          onClick={onClose}
        />

        {/* INNER BORDER BOX */}
        <div
          className="relative bg-white rounded-lg"
          style={{
            border: "1px solid #E7EFEA",
            borderRadius: "12px",
            width: "100%",
            padding: "24px",
          }}
        >
          {/* SUCCESS ICON */}
          <div className="flex justify-center mt-2">
            <img
              src={successIcon}
              alt="success"
              style={{ width: "52px", height: "52px" }}
            />
          </div>

          {/* TITLE */}
          <p
            className="text-center font-semibold mt-4"
            style={{ color: "#115D29", fontSize: "18px" }}
          >
            Auto Purchase Order Generated Successfully!
          </p>

          {/* DESCRIPTION */}
          <p
            className="text-center mt-3"
            style={{
              color: "#115D29",
              fontSize: "14px",
              maxWidth: "360px",
              margin: "0 auto",
              lineHeight: "20px",
              marginBottom: "24px",
            }}
          >
            Your out-of-stock medicines have been reordered from the best
            available source. You’ll receive an update once the distributor
            confirms dispatch.
          </p>

          {/* LIST BOX */}
          <div
            className="rounded-md"
            style={{
              background: "#F7FDF9",
              padding: "18px",
              borderRadius: "8px",
            }}
          >
            {[
              "PO #PO-10294 created and sent to 2 distributors.",
              "Estimated fulfillment in 3 days.",
              "Retailer will receive updates via Notifications tab.",
              "Distributor will receive updates via Notifications tab.",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                <img
                  src={tickIcon}
                  alt="tick"
                  style={{ width: "18px", height: "18px" }}
                />
                <p
                  style={{
                    fontSize: "14px",
                    color: "#115D29",
                    lineHeight: "18px",
                  }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
