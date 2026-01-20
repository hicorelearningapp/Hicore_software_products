import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import backIcon from "../../../../assets/Customers/Cart/back.png";
import addressIcon from "../../../../assets/Customers/Cart/addressIcon.png";
import deliveryIcon from "../../../../assets/Customers/Cart/deliveryIcon.png";
import aiSuggestIcon from "../../../../assets/Customers/Cart/aiSuggestIcon.png";

// Payment icons
import upiIcon from "../../../../assets/Customers/Cart/upi.png";
import cardIcon from "../../../../assets/Customers/Cart/card.png";
import codIcon from "../../../../assets/Customers/Cart/cod.png";
import bankIcon from "../../../../assets/Customers/Cart/bank.png";

// Bottom bar
import totalIcon from "../../../../assets/Customers/Cart/total.png";
import invoiceIcon from "../../../../assets/Customers/Cart/invoice.png";

// Popup Icons
import partyIcon from "../../../../assets/Customers/Cart/party.png";
import tickIcon from "../../../../assets/Customers/Cart/tick.png";
import closeIcon from "../../../../assets/Customers/Cart/close.png";

//  Import Nearest Retailer Page
import NearestRetailer from "./NearestRetailer";

const Checkbox = ({ label }) => (
  <label className="flex items-start gap-2 text-[#115D29] text-sm cursor-pointer">
    <input type="checkbox" className="mt-[3px] accent-[#115D29]" />
    {label}
  </label>
);

const CheckoutPage = ({ cart = [] }) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  //  this decides whether to show Checkout or NearestRetailer
  const [showNearest, setShowNearest] = useState(false);

  const [selectedDelivery, setSelectedDelivery] = useState("retailer");

  const calculateRowTotal = (item) => (item.price + item.gst) * item.qty;
  const grandTotal = cart.reduce((sum, item) => sum + calculateRowTotal(item), 0);

  //  If user clicks "Change Retailer" → load NearestRetailer
  if (showNearest) {
    return <NearestRetailer />;
  }

  return (
    <div className="w-full min-h-screen px-8 py-6">

      {/* BACK */}
      <div
        className="flex items-center gap-2 text-[#115D29] mb-4 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <img src={backIcon} alt="back" className="w-4 h-4" />
        <span className="font-medium">Back</span>
      </div>

      <h2 className="text-xl font-semibold text-[#115D29] mb-1">
        Checkout & Confirm Your Order
      </h2>
      <p className="text-sm text-[#4B6A57] mb-6">
        Review your medicines, delivery details, and payment before placing your order.
      </p>

      {/* TWO BOXES */}
      <div className="flex gap-4">

        {/* ADDRESS */}
        <div className="w-full h-[164px] border border-[#E7EFEA] rounded-[8px] p-4 flex gap-4 bg-white">
          <div className="w-[132px] h-[132px] bg-[#E7EFEA] rounded-[8px] p-[4px] flex items-center justify-center">
            <img src={addressIcon} className="w-[100px] h-[100px] object-contain" />
          </div>

          <div className="flex flex-col justify-between w-full mt-3">
            <div>
              <p className="text-[#115D29] font-semibold">Anita Sharma</p>

              <p className="text-[#115D29] text-sm mt-2">
                23, Green View Apartments, Sector 14, Gurugram, Haryana – 122001
              </p>

              <div className="flex justify-between text-sm text-[#115D29] mt-3 pr-4">
                <span>+91 98765 43210</span>
                <span>anita.sharma@email.com</span>
              </div>
            </div>

            <div className="flex justify-between text-xs mt-2">
              <span className="text-[#2874BA] cursor-pointer">Edit Address</span>
              <span className="text-[#2874BA] cursor-pointer">Add New Address</span>
            </div>
          </div>
        </div>

        {/* DELIVERY OPTIONS */}
        <div className="w-full h-[164px] border border-[#E7EFEA] rounded-[8px] p-4 flex gap-4 bg-white">
          <div className="w-[132px] h-[132px] bg-[#E7EFEA] rounded-[8px] p-[4px] flex items-center justify-center">
            <img src={deliveryIcon} className="w-[100px] h-[100px] object-contain" />
          </div>

          <div className="flex flex-col justify-start w-full">

            <p className="text-[#115D29] font-semibold mt-3 mb-2">Delivery Options:</p>

            {/* FIRST OPTION + BUTTON */}
            <div className="flex justify-between items-center mb-2">
              <label
                className="flex items-start gap-2 text-[#115D29] text-sm cursor-pointer"
                onClick={() => setSelectedDelivery("retailer")}
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={selectedDelivery === "retailer"}
                  className="mt-1 accent-[#115D29]"
                />
                Apollo Pharmacy - 23 MG Road, Gurugram
              </label>

              {selectedDelivery === "retailer" && (
                <button
                  onClick={() => setShowNearest(true)}
                  className="bg-[#2874BA] text-white px-2 py-1.5 rounded-[6px] text-sm"
                >
                  Change Retailer
                </button>
              )}
            </div>

            {/* SECOND OPTION */}
            <label
              className="flex items-start gap-2 text-[#115D29] text-sm cursor-pointer"
              onClick={() => setSelectedDelivery("appstore")}
            >
              <input
                type="radio"
                name="delivery"
                checked={selectedDelivery === "appstore"}
                className="mt-1 accent-[#115D29]"
              />
              App Store - Save 10% (Delivery in 2 days from distributor stock)
            </label>
          </div>
        </div>
      </div>

     

      {/* ORDER SUMMARY */}
      <div className="mt-10 w-full border border-[#E7EFEA] rounded-[8px] bg-white">
        <div className="w-full h-[52px] px-4 py-2 border-b border-[#E7EFEA] bg-[#FAF9F9] text-[#115D29] font-semibold rounded-t-[8px] flex items-center">
          Order Summary
        </div>

        <div className="w-full px-4 py-4">
          <div className="w-full border border-[#DBE7DF] rounded-[8px] overflow-hidden">

            <div className="w-full h-[52px] px-4 py-2 border-b border-[#DBE7DF] bg-white flex items-center text-[#115D29] font-semibold">
              <div className="w-[10%]">S.No</div>
              <div className="w-[40%]">Medicine</div>
              <div className="w-[15%]">Quantity</div>
              <div className="w-[15%]">Unit Price</div>
              <div className="w-[10%]">GST(₹)</div>
              <div className="w-[10%]">Total</div>
            </div>

            {cart.map((item, index) => (
              <div key={item.id} className="w-full h-[52px] px-4 py-2 flex items-center text-[#115D29]">
                <div className="w-[10%]">{index + 1}</div>
                <div className="w-[40%]">{item.name}</div>
                <div className="w-[15%]">{item.qty}</div>
                <div className="w-[15%]">₹{item.price}</div>
                <div className="w-[10%]">₹{item.gst}</div>
                <div className="w-[10%]">₹{calculateRowTotal(item)}</div>
              </div>
            ))}

            <div className="w-full h-[52px] flex items-center justify-end px-[100px] py-2 border-t border-[#DBE7DF] text-[#115D29] font-semibold">
              Total: ₹{grandTotal.toFixed(2)}
            </div>

          </div>
        </div>
      </div>

      {/* AI SUGGESTION */}
      <div className="w-full mt-6 border border-[#2874BA] rounded-[8px] bg-[#2874BA0D] p-4">
        <div className="flex items-center gap-3">
          <img src={aiSuggestIcon} alt="AI" className="w-8 h-8" />
          <p className="text-[#2874BA] font-semibold text-sm">AI Suggestion:</p>
        </div>

        <div className="flex justify-between items-center mt-2">
          <p className="text-[#2874BA] text-sm">
            Add Dettol Hand Sanitizer (₹30) — Customers often buy it with Paracetamol.
          </p>

          <button className="bg-[#2874BA] text-white px-6 py-2 rounded-[6px] font-medium">
            Add to Cart
          </button>
        </div>
      </div>

      {/* PAYMENT OPTIONS */}
      <div className="flex gap-4 mt-6">

        <div className="w-full h-[212px] border border-[#E7EFEA] rounded-[8px] p-4 flex flex-col gap-4 bg-white">
          <p className="text-[#115D29] font-semibold text-sm">Payment Options</p>

          <div className="grid grid-cols-2 gap-4">

            <div className="w-full h-[56px] flex items-center border border-[#B5CDBD] rounded-[8px] px-4 py-2">
              <p className="text-[#115D29] text-sm">UPI/Wallet (GPay, PhonePe, Paytm)</p>
              <img src={upiIcon} className="w-8 h-8 ml-auto" />
            </div>

            <div className="w-full h-[56px] flex items-center border border-[#B5CDBD] rounded-[8px] px-4 py-2">
              <p className="text-[#115D29] text-sm">Credit / Debit Card</p>
              <img src={cardIcon} className="w-8 h-8 ml-auto" />
            </div>

            <div className="w-full h-[56px] flex items-center border border-[#B5CDBD] rounded-[8px] px-4 py-2">
              <p className="text-[#115D29] text-sm">Cash on Delivery (COD)</p>
              <img src={codIcon} className="w-8 h-8 ml-auto" />
            </div>

            <div className="w-full h-[56px] flex items-center border border-[#B5CDBD] rounded-[8px] px-4 py-2">
              <p className="text-[#115D29] text-sm">Net Banking</p>
              <img src={bankIcon} className="w-8 h-8 ml-auto" />
            </div>

          </div>
        </div>

        {/* ORDER PREFERENCES */}
        <div className="w-full h-[212px] border border-[#E7EFEA] rounded-[8px] p-4 flex flex-col gap-4 bg-white">
          <p className="text-[#115D29] font-semibold text-sm">Order Preferences</p>

          <div className="flex flex-col gap-4">
            <Checkbox label="Send me order updates on WhatsApp" />
            <Checkbox label='Enable "Auto Refill" for recurring medicines' />
            <Checkbox label="Notify when any item is back in stock" />
            <Checkbox label="Email invoice automatically on delivery" />
          </div>

        </div>
      </div>

      {/* TOTAL BOX */}
      <div
        className="
          w-full h-[76px] border border-[#30B130]
          bg-[#30B1300D] rounded-[8px] mt-6 p-4
          flex items-center justify-between
        "
      >
        <div className="flex items-center gap-3 text-[#30B130] font-semibold text-sm">
          <img src={totalIcon} alt="total" className="w-8 h-8" />
          Total Payable: ₹{grandTotal.toFixed(2)}
        </div>

        <button
          className="
            w-[166px] h-[44px] bg-[#30B130]
            text-white rounded-[8px] flex items-center justify-center gap-2
            px-4 py-1 text-[13px] font-medium
          "
        >
          <img src={invoiceIcon} className="w-5 h-5" />
          Generate Invoice
        </button>
      </div>

      {/* BUTTONS */}
      <div className="mt-8 w-full flex gap-4">

        <button
          onClick={() => setShowPopup(true)}
          className=" w-full h-[52px] rounded-[8px] bg-[#115D29] text-white border border-[#115D29] px-6 py-2 font-semibold
            transition-all duration-200 hover:bg-[#0A4A1F]
            hover:shadow-[0px_4px_4px_0px_#00000040] hover:-translate-y-[2px]
          "
        >
          Review & Confirm
        </button>

        <button
          className="
            w-full h-[52px] rounded-[8px] bg-white text-[#115D29] px-6 py-2 font-semibold border border-[#115D29]
            transition-all duration-200
            hover:bg-[#FAF9F9] hover:border-[#B5CDBD]
          "
        >
          Continue Shopping
        </button>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">

          <div
            className="
              w-[463px] h-[408px] bg-white
              rounded-[8px] p-4 relative
              flex items-center justify-center
            "
          >

            <img
              src={closeIcon}
              onClick={() => setShowPopup(false)}
              className="w-5 h-5 absolute top-2 right-3 cursor-pointer"
            />

            <div
              className="
                w-[431px] h-[348px] border border-[#E7EFEA]
                rounded-[8px] p-4 flex flex-col items-center
              "
            >
              <img src={partyIcon} className="w-12 h-12 mt-2" />

              <p className="text-[#30B130] font-semibold text-[18px] mt-4">
                Order Confirmed!
              </p>

              <p className="text-[#115D29] text-sm mt-1 mb-3 text-center mt-4">
                Your medicines will be delivered by 5 Nov 2025.
              </p>

              <div
                className="
                  w-[399px] bg-[#FAF9F9] rounded-[8px]
                  p-4 flex flex-col gap-3 mt-auto
                "
              >
                <div className="flex items-start gap-2">
                  <img src={tickIcon} className="w-5 h-5 mt-[2px]" />
                  <p className="text-[#115D29] text-sm">
                    Retailer: <span className="font-semibold">Apollo Pharmacy - 23 MG Road, Gurugram</span>
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <img src={tickIcon} className="w-5 h-5 mt-[2px]" />
                  <p className="text-[#115D29] text-sm">
                    Invoice #: <span className="font-semibold">INV-67824</span> (Auto Generated)
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <img src={tickIcon} className="w-5 h-5 mt-[2px]" />
                  <p className="text-[#115D29] text-sm">
                    You can track the order from your <span className="font-semibold">My Orders</span> section.
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default CheckoutPage;
