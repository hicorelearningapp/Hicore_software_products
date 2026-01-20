import React from "react";
import successIcon from "../../../../assets/Customers/Prescription/party.png"; 
import closeIcon from "../../../../assets/Customers/Prescription/close.png"; 

const OrderSuccessModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white  rounded-xl p-9 w-[380px] relative shadow-lg">
        {/* Close Button */}

        <button
          onClick={onClose}
          className="absolute top-2 right-5 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <img src={closeIcon} alt="close" className="w-5 h-5" />
        </button>
        <div className="border border-gray-200 p-4 rounded-lg">
          {/* Icon */}
          <div className="w-full flex justify-center mb-4">
            <img src={successIcon} alt="success" className="w-14 h-14" />
          </div>

          {/* Title */}
          <h2 className="text-center text-xl font-semibold text-[#155C2A] mb-3">
            Order Accepted!
          </h2>

          {/* Description */}
          <p className="text-center text-[#155C2A] text-sm leading-relaxed">
            Our system has updated your stock <br /> and notified the customer
            for delivery.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
