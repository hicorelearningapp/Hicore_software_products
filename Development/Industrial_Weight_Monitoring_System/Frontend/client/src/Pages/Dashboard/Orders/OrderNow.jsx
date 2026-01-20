import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backicon from "../../../assets/Dashboard/Orders/Circle Arrow.png";
import downarrow from "../../../assets/Dashboard/Orders/down-arrow.png";

const ITEM_PRICE_MAP = {
  "INV-0012": { name: "Surgical Gloves", price: 25 },
  "INV-0015": { name: "Sanitizer Bottles", price: 20 },
};

const OrderNow = () => {
  const navigate = useNavigate();

  // Order state
  const [vendor, setVendor] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [address, setAddress] = useState("");

  // 🔹 Load Razorpay Script on Mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const selectedItem = ITEM_PRICE_MAP[itemCode];

  const totalPrice = useMemo(() => {
    if (!selectedItem || !quantity) return 0;
    return selectedItem.price * Number(quantity);
  }, [selectedItem, quantity]);

  const handlePlaceOrder = async () => {
    if (!vendor || !itemCode || !quantity || !deliveryMode || !paymentMode) {
      alert("Please fill all required fields");
      return;
    }

    if (deliveryMode === "Door Delivery" && !address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    if (paymentMode === "Online Payment") {
      openRazorpay();
    } else {
      alert("Order placed successfully (Payment pending)");
      console.log("Order placed:", { vendor, itemCode, quantity, deliveryMode, paymentMode, address });
    }
  };

  const openRazorpay = async () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: "rzp_test_RuwjI4J3paXOIh", 
      amount: totalPrice * 100,
      currency: "INR",
      name: "Inventory App",
      description: "Order Payment",
      handler: function (response) {
        alert("Payment successful! ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: { color: "#1769FF" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="flex flex-col rounded-[20px] md:rounded-[40px] p-[20px] md:p-[36px] gap-[24px] md:gap-[36px] bg-white border border-[#E7EAEC]">
      
      {/* Header */}
      <div className="flex flex-col gap-[12px]">
        <button onClick={() => navigate(-1)} className="flex items-center gap-[8px] w-fit">
          <img src={backicon} className="w-[16px] h-[16px]" alt="back" />
          <span className="text-[14px] text-[#0A2A43]">Back</span>
        </button>
        <h2 className="font-semibold text-[20px] md:text-[24px] text-[#1769FF]">
          AI Smart Order
        </h2>
      </div>

      {/* Main Content - Responsive Grid */}
      <div className="flex flex-col lg:flex-row gap-[24px]">
        
        {/* LEFT CARD - FORM */}
        <div className="w-full lg:w-1/2 rounded-[24px] md:rounded-[36px] p-[20px] md:p-[24px] border border-[#8A939B] flex flex-col gap-[20px]">
          <h3 className="font-semibold text-[16px] text-[#0A2A43]">Order Details</h3>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[14px] font-medium">Choose Vendor</label>
            <div className="relative">
              <select
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full appearance-none px-[16px] py-[12px] border rounded-[80px] bg-transparent outline-none"
              >
                <option value="">Select Vendor</option>
                <option>ABC Co.</option>
                <option>MediSuppliers</option>
                <option>HealthCorp</option>
              </select>
              <img src={downarrow} className="absolute right-4 top-1/2 -translate-y-1/2 w-[16px] pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[14px] font-medium">Choose Item Code</label>
            <div className="relative">
              <select
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
                className="w-full appearance-none px-[16px] py-[12px] border rounded-[80px] bg-transparent outline-none"
              >
                <option value="">Select Item Code</option>
                <option value="INV-0012">INV-0012</option>
                <option value="INV-0015">INV-0015</option>
              </select>
              <img src={downarrow} className="absolute right-4 top-1/2 -translate-y-1/2 w-[16px] pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[14px] font-medium">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="px-[16px] py-[12px] border rounded-[80px] outline-none focus:border-[#1769FF]"
            />
          </div>

          <div className="flex flex-col gap-[12px]">
            <label className="text-[14px] font-medium">Delivery Mode</label>
            <div className="flex flex-wrap gap-[20px]">
              {["Pickup", "Door Delivery"].map((mode) => (
                <label key={mode} className="flex items-center gap-[8px] cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    value={mode}
                    checked={deliveryMode === mode}
                    onChange={(e) => setDeliveryMode(e.target.value)}
                    className="accent-[#1769FF] w-4 h-4"
                  />
                  <span className="text-[14px]">{mode}</span>
                </label>
              ))}
            </div>
          </div>

          {deliveryMode === "Door Delivery" && (
            <div className="flex flex-col gap-[8px]">
              <label className="text-[14px] font-medium">Delivery Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter full address"
                className="border rounded-[16px] p-[12px] h-[80px] outline-none focus:border-[#1769FF]"
              />
            </div>
          )}

          <div className="flex flex-col gap-[12px]">
            <label className="text-[14px] font-medium">Payment Mode</label>
            <div className="flex flex-col gap-[10px]">
              {["Online Payment", "Credit / Debit Card", "Cash on Delivery"].map((mode) => (
                <label key={mode} className="flex items-center gap-[8px] cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value={mode}
                    checked={paymentMode === mode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="accent-[#1769FF] w-4 h-4"
                  />
                  <span className="text-[14px]">{mode}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT CARD – PREVIEW */}
        <div className="w-full lg:w-1/2 rounded-[24px] md:rounded-[36px] p-[20px] md:p-[24px] border border-[#8A939B] flex flex-col gap-[20px] h-fit">
          <h3 className="font-semibold text-[16px] text-[#0A2A43]">Preview Order</h3>
          <div className="border border-[#E7EAEC] rounded-[20px] overflow-hidden">
            <div className="flex bg-[#F4F6F8] px-[16px] py-[12px] font-semibold text-[13px] text-[#8A939B] uppercase">
              <div className="w-1/2">Item</div>
              <div className="w-1/4 text-right">Qty</div>
              <div className="w-1/4 text-right">Price</div>
            </div>

            {selectedItem && quantity ? (
              <div className="flex px-[16px] py-[16px] text-[14px] border-t border-[#E7EAEC]">
                <div className="w-1/2 font-medium">{selectedItem.name}</div>
                <div className="w-1/4 text-right">{quantity}</div>
                <div className="w-1/4 text-right font-bold text-[#1769FF]">₹{totalPrice}</div>
              </div>
            ) : (
              <div className="p-[32px] text-center text-gray-400 text-[14px]">
                Enter details to see preview
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col sm:flex-row gap-[16px]">
        <button
          onClick={handlePlaceOrder}
          className="w-full sm:w-1/2 bg-[#1769FF] text-white py-[14px] rounded-[80px] font-bold text-[15px] hover:bg-blue-700 transition-colors"
        >
          Place Order Now
        </button>
        <button className="w-full sm:w-1/2 border border-[#1769FF] text-[#1769FF] py-[14px] rounded-[80px] font-bold text-[15px] hover:bg-blue-50 transition-colors">
          Track Order
        </button>
      </div>
    </div>
  );
};

export default OrderNow;