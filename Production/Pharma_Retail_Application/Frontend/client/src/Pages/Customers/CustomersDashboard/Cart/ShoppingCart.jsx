import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

import backIcon from "../../../../assets/Customers/Cart/back.png";
import minusIcon from "../../../../assets/Customers/Cart/minus.png";
import plusIcon from "../../../../assets/Customers/Cart/plus.png";
import deleteIcon from "../../../../assets/Customers/Cart/delete.png";

import reco1 from "../../../../assets/Customers/Cart/reco1.png";
import reco2 from "../../../../assets/Customers/Cart/reco2.png";
import reco3 from "../../../../assets/Customers/Cart/reco3.png";

import CheckoutPage from "./CheckoutPage";

const ShoppingCart = () => {
  const { cart, updateQty, removeItem } = useCart();
  const [showCheckout, setShowCheckout] = React.useState(false);

  const navigate = useNavigate();

  const calculateRowTotal = (item) => (item.price + item.gst) * item.qty;
  const grandTotal = cart.reduce((sum, item) => sum + calculateRowTotal(item), 0);

  if (showCheckout) return <CheckoutPage cart={cart} />;

  return (
    <div className="w-full min-h-screen px-8 py-6">

      <div
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#115D29] mb-4 cursor-pointer"
      >
        <img src={backIcon} className="w-4 h-4" />
        <span className="font-medium">Back</span>
      </div>

      <h2 className="text-xl font-semibold text-[#115D29] mb-4">Shopping Cart</h2>

      <div className="flex flex-col gap-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="w-full flex items-center justify-between border border-[#E7EFEA] rounded-[8px] p-4 bg-white"
            style={{ height: "112px" }}
          >
            <div className="flex items-center gap-4">
              <img src={item.image} className="w-14 h-14 object-contain" />

              <div className="flex flex-col">
                <p className="font-medium text-[#115D29]">{item.name}</p>

                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => updateQty(item.id, "dec")}>
                    <img src={minusIcon} className="w-5 h-5" />
                  </button>

                  <span className="text-[#115D29] font-medium">{item.qty}</span>

                  <button onClick={() => updateQty(item.id, "inc")}>
                    <img src={plusIcon} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <button onClick={() => removeItem(item.id)}>
                <img src={deleteIcon} className="w-5 h-5" />
              </button>

              <p className="text-[#115D29] font-semibold">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY — unchanged */}
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

      {/* Recommended section — unchanged */}
      <div className="mt-10 w-full border border-[#E7EFEA] rounded-[8px] p-4">
        <p className="text-[#115D29] font-semibold mb-4">Recommended for You</p>

        <div className="flex gap-4">
          {[reco1, reco2, reco3].map((icon, i) => (
            <div
              key={i}
              className="
                w-full h-[136px] border border-[#E7EFEA] rounded-[8px] p-4
                hover:bg-[#FAF9F9] hover:shadow-[0px_4px_4px_0px_#00000040]
                hover:border-[#B5CDBD] cursor-pointer
              "
            >
              <img src={icon} className="w-8 h-8 mb-3" />
              <p className="text-[#000000] font-medium mb-3">
                {i === 0
                  ? "Time to reorder Paracetamol 500mg"
                  : i === 1
                  ? "You might need Vitamin C 1000mg again"
                  : "Top-rated immunity boosters nearby"}
              </p>
              <p className="text-[#2874BA] text-sm">View Details &gt;</p>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons — unchanged */}
      <div className="mt-8 w-full flex gap-4">
        <button
          onClick={() => setShowCheckout(true)}
          className="
            w-full h-[52px] rounded-[8px]
            bg-[#115D29] text-white border border-[#115D29]
            px-6 py-2 font-semibold
            font-['Roboto'] text-[14px] leading-[36px] text-center
            transition-all duration-200
            hover:bg-[#0A4A1F]
            hover:shadow-[0px_4px_4px_0px_#00000040]
            hover:-translate-y-[2px]
          "
        >
          Checkout
        </button>

        <button
          className="
            w-full h-[52px] rounded-[8px]
            bg-white text-[#115D29]
            px-6 py-2 font-semibold border border-[#115D29]
            font-['Roboto'] text-[14px] leading-[36px] text-center
            transition-all duration-200
            hover:bg-[#FAF9F9]
            hover:border-[#B5CDBD]
            hover:shadow-[0px_4px_4px_0px_#00000040]
            hover:-translate-y-[2px]
          "
        >
          Continue Shopping
        </button>
      </div>

    </div>
  );
};

export default ShoppingCart;
