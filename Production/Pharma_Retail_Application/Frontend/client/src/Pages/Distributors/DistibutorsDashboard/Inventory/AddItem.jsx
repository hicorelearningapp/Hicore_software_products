import React, { useState } from "react";

import closeIcon from "../../../../assets/RetailersDashboard/close.png";
import scanIcon from "../../../../assets/RetailersDashboard/scan.png";


export default function AddItem({ onClose }) {
  const [status, setStatus] = useState("");
  const [generic, setGeneric] = useState("");
  const [form, setForm] = useState({
    name: "",
    brand: "",
    qtyMin: "",
    qtyMax: "",
    price: "",
    batch: "",
    expiry: "",
  });

  const onChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div
      className="w-full bg-white p-8 rounded-xl overflow-y-auto hide-scroll"
      style={{
        maxHeight: "90vh",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <style>{`
  /* hide webkit scrollbar */
  .hide-scroll::-webkit-scrollbar { display: none; }

  /* global green color */
  .green-text { color: #115D29 !important; }

  /* input boxes green border */
  .input-box {
    border: 1px solid #115D29;
    border-radius: 10px;
    padding: 12px 14px;
    background: #FFFFFF;
    color: #115D29;
  }
  .input-box::placeholder {
    color: #7DA890;
  }

  .input-label { 
    color: #115D29; 
    font-weight: 600; 
    font-size: 14px; 
  }

  /* QR box border green */
  .qr-box {
    border-radius: 12px;
    border: 1px solid #115D29;
    background: linear-gradient(180deg,#F7FBF8,#ffffff);
    padding: 18px;
    color: #115D29;
  }

  /* keep scan button blue */
  .scan-btn {
    background: #2B78C6;
    color: #fff;
    padding: 10px 16px;
    border-radius: 8px;
    display:flex;
    align-items:center;
    gap:8px;
    font-weight:600;
  }

  /* manual card border green */
  .manual-card {
    border-radius: 12px;
    border: 1px solid #115D29;
    padding: 18px;
    background: #fff;
    color: #115D29;
  }

  /* small divider with 'Or' green line */
  .or-line {
    height: 1px;
    background: #115D29;
  }

  /* radio styles */
  .radio-custom {
    width: 16px;
    height: 16px;
    border-radius: 999px;
    border: 2px solid #115D29;
    display: inline-block;
    position: relative;
    margin-right: 8px;
  }
  .radio-custom.checked {
    background: #115D29;
    border-color: #115D29;
  }

  .radio-label { 
    color: #115D29; 
    font-weight: 600; 
  }

  /* status labels */
  .status-row label { 
    display:flex; 
    align-items:center; 
    gap:10px; 
    cursor:pointer; 
    color:#115D29; 
  }

  /* Save button */
  .save-btn {
    background: #115D29;
    color: #fff;
    padding: 12px;
    border-radius: 8px;
    font-weight: 700;
  }

  /* responsive tweaks */
  @media (max-width:640px) {
    .qr-box, .manual-card { padding: 14px; }
    .scan-btn { padding: 8px 12px; }
  }
`}</style>

      {/* TOP: Title + close */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold" style={{ color: "#115D29" }}>
          Add Item
        </h1>

        <img
          src={closeIcon}
          alt="close"
          className="w-6 h-6 cursor-pointer"
          onClick={onClose}
        />
      </div>

      {/* QR SCAN BOX */}
      <div className="qr-box mb-6  flex items-center justify-between">
        <p className="text-sm" style={{ color: "#115D29", maxWidth: "70%" }}>
          Scan QR code of the medicine to add it to the inventory.
        </p>

        <button className="scan-btn" type="button">
          <img src={scanIcon} alt="scan" className="w-4 h-4" />
          <span>Scan QR Code</span>
        </button>
      </div>

      {/* OR DIVIDER */}
      <div className="flex items-center my-4">
        <div className="flex-1 or-line" />
        <div className="px-4 text-sm text-[#8DAA98]">Or</div>
        <div className="flex-1 or-line" />
      </div>

      {/* ADD MANUALLY CARD */}
      <div className="manual-card">
        <p
          className="mb-4"
          style={{ color: "#115D29", fontSize: 16, fontWeight: 700 }}
        >
          Add Manually
        </p>

        <div className="grid grid-cols-1 gap-4">
          {/* Medicine Name */}
          <div>
            <label className="block mb-2 input-label">Medicine Name</label>
            <input
              type="text"
              placeholder="Enter Medicine Name"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="w-full input-box text-sm outline-none"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block mb-2 input-label">Brand</label>
            <input
              type="text"
              placeholder="Enter Brand Name"
              value={form.brand}
              onChange={(e) => onChange("brand", e.target.value)}
              className="w-full input-box text-sm outline-none"
            />
          </div>

          {/* Quantity (Min / Max) + Price */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 input-label">Quantity (Min)</label>
              <select
                value={form.qtyMin}
                onChange={(e) => onChange("qtyMin", e.target.value)}
                className="w-full input-box text-sm outline-none"
              >
                <option value="">Min no.</option>
                <option>1</option>
                <option>2</option>
                <option>5</option>
                <option>10</option>
              </select>
            </div>

            <div>
              <label
                className="block mb-2 input-label"
                style={{ visibility: "hidden" }}
              >
                Max label
              </label>
              <select
                value={form.qtyMax}
                onChange={(e) => onChange("qtyMax", e.target.value)}
                className="w-full input-box text-sm outline-none"
              >
                <option value="">Max no.</option>
                <option>5</option>
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 input-label">Price</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="₹"
                  value={form.price}
                  onChange={(e) => onChange("price", e.target.value)}
                  className="w-full input-box text-sm outline-none pl-10"
                />
              </div>
            </div>
          </div>

          {/* Batch + Expiry */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 input-label">Batch</label>
              <input
                type="text"
                placeholder="Enter Batch Number"
                value={form.batch}
                onChange={(e) => onChange("batch", e.target.value)}
                className="w-full input-box text-sm outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 input-label">Expiry Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={form.expiry}
                  onChange={(e) => onChange("expiry", e.target.value)}
                  className="w-full input-box text-sm outline-none pr-10"
                />
                {/* optional calendar icon, uncomment if available */}
                {/* <img src={calendarIcon} alt="" className="absolute right-3 top-3 w-5 h-5 opacity-60" /> */}
              </div>
            </div>
          </div>

          {/* Generic */}
          <div>
            <label className="block mb-2 input-label">Generic</label>
            <div className="flex items-center gap-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <span
                  className={`radio-custom ${
                    generic === "Yes" ? "checked" : ""
                  }`}
                />
                <input
                  type="radio"
                  name="generic"
                  value="Yes"
                  checked={generic === "Yes"}
                  onChange={(e) => setGeneric(e.target.value)}
                  className="hidden"
                />
                <span className="radio-label">Yes</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <span
                  className={`radio-custom ${
                    generic === "No" ? "checked" : ""
                  }`}
                />
                <input
                  type="radio"
                  name="generic"
                  value="No"
                  checked={generic === "No"}
                  onChange={(e) => setGeneric(e.target.value)}
                  className="hidden"
                />
                <span className="radio-label">No</span>
              </label>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-2 input-label">Status</label>
            <div className="flex items-center gap-10 status-row">
              <label>
                <input
                  type="radio"
                  name="status"
                  value="In Stock"
                  checked={status === "In Stock"}
                  onChange={(e) => setStatus(e.target.value)}
                  className="hidden"
                />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    className={`radio-custom ${
                      status === "In Stock" ? "checked" : ""
                    }`}
                  />
                  <span style={{ color: "#115D29", fontWeight: 600 }}>
                    In Stock
                  </span>
                </div>
              </label>

              <label>
                <input
                  type="radio"
                  name="status"
                  value="Low Stock"
                  checked={status === "Low Stock"}
                  onChange={(e) => setStatus(e.target.value)}
                  className="hidden"
                />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    className={`radio-custom ${
                      status === "Low Stock" ? "checked" : ""
                    }`}
                  />
                  <span style={{ color: "#115D29", fontWeight: 600 }}>
                    Low Stock
                  </span>
                </div>
              </label>

              <label>
                <input
                  type="radio"
                  name="status"
                  value="No Stock"
                  checked={status === "No Stock"}
                  onChange={(e) => setStatus(e.target.value)}
                  className="hidden"
                />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    className={`radio-custom ${
                      status === "No Stock" ? "checked" : ""
                    }`}
                  />
                  <span style={{ color: "#115D29", fontWeight: 600 }}>
                    No Stock
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="mt-8">
          <button
            className="w-full save-btn"
            type="button"
            onClick={() => {
              // integrate save logic here
              // e.g. validate and call API
              console.log("save", { ...form, generic, status });
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
