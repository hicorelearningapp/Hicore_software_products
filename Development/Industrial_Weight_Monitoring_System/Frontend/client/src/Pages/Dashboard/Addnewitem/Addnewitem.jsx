import React, { useState } from "react";
import closeicon from "../../../assets/Dashboard/Inventory/close.png";
import additem from "../../../assets/Dashboard/Inventory/additem.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const Addnewitem = ({ onClose }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mapped to API Schema
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [perUnitWeight, setPerUnitWeight] = useState(0);
  const [measurement, setMeasurement] = useState("count"); // Default to count
  const [minThreshold, setMinThreshold] = useState(0);
  const [maxThreshold, setMaxThreshold] = useState(0);

  const handleSubmit = async () => {
    if (!itemName || !category) {
      alert("Please fill in the Item Name and Category");
      return;
    }

    // Exact mapping to the POST /items endpoint
    const payload = {
      ItemName: itemName,
      Category: category,
      Description: description,
      PerUnitWeight: Number(perUnitWeight),
      Measurement: measurement,
      MinThreshold: Number(minThreshold),
      MaxThreshold: Number(maxThreshold)
    };

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setShowSuccess(true);
      } else {
        alert(data.message || "Failed to create item");
      }
    } catch (err) {
      alert("Something went wrong connecting to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-[16px] md:p-[36px] relative">
      <div className="flex flex-col rounded-[24px] md:rounded-[40px] p-[20px] md:p-[36px] gap-[24px] border border-[#8A939B] bg-white shadow-xl">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-[4px]">
            <h2 className="font-bold text-[20px] text-[#0A2A43]">Add New Product</h2>
            <p className="text-[14px] text-gray-500">Register this item in the master product list.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <img src={closeicon} className="w-4 h-4" alt="close" />
          </button>
        </div>

        {/* Form Grid */}
        <div className="flex flex-col gap-[20px] p-[16px] md:p-[24px] rounded-[24px] border border-[#E7EAEC]">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            <Field label="Item Name" placeholder="e.g. Bolt" value={itemName} onChange={setItemName} />
            <Field label="Category" placeholder="e.g. Tools" value={category} onChange={setCategory} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] items-end">
            <Field label="Per Unit Weight" type="number" value={perUnitWeight} onChange={setPerUnitWeight} />
            
            {/* Measurement Radio Group */}
            <div className="flex flex-col gap-[8px] flex-1">
              <label className="text-[13px] font-bold text-[#0A2A43] uppercase tracking-tight opacity-70 ml-2">
                Measurement Unit
              </label>
              <div className="flex items-center gap-6 px-4 py-[10px] bg-gray-50 rounded-full border border-transparent">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="measurement"
                    value="count"
                    checked={measurement === "count"}
                    onChange={(e) => setMeasurement(e.target.value)}
                    className="w-4 h-4 accent-[#1769FF]"
                  />
                  <span className="text-[14px] text-[#0A2A43]">Count</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="measurement"
                    value="gram"
                    checked={measurement === "gram"}
                    onChange={(e) => setMeasurement(e.target.value)}
                    className="w-4 h-4 accent-[#1769FF]"
                  />
                  <span className="text-[14px] text-[#0A2A43]">Gram</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            <Field label="Min Threshold" type="number" value={minThreshold} onChange={setMinThreshold} />
            <Field label="Max Threshold" type="number" value={maxThreshold} onChange={setMaxThreshold} />
          </div>

          <Field label="Description" placeholder="Enter item details..." value={description} onChange={setDescription} isTextArea={true} />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-[12px]">
          <button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="flex-1 py-[16px] rounded-full bg-[#1769FF] text-white font-bold hover:bg-[#1255CC] transition-all disabled:opacity-50 shadow-lg shadow-blue-100"
          >
            {loading ? "Creating..." : "Confirm & Create Item"}
          </button>
          <button 
            onClick={onClose} 
            className="flex-1 py-[16px] rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>

        {/* Success Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white/98 flex items-center justify-center rounded-[24px] z-50 animate-fadeIn">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <img src={additem} className="w-10 h-10" alt="success" />
              </div>
              <h3 className="text-[24px] font-bold text-[#0A2A43]">Product Registered!</h3>
              <p className="text-gray-500 mt-2 max-w-[300px] mx-auto">
                The new item has been added to the master list and is ready for device linking.
              </p>
              <button 
                onClick={() => { setShowSuccess(false); onClose(); }} 
                className="mt-8 px-12 py-4 rounded-full bg-[#0A2A43] text-white font-bold hover:scale-105 transition-transform"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, type = "text", placeholder, isTextArea = false }) => (
  <div className="flex flex-col gap-[8px] flex-1">
    <label className="text-[13px] font-bold text-[#0A2A43] uppercase tracking-tight opacity-70 ml-2">
      {label}
    </label>
    {isTextArea ? (
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows="2"
        className="px-[20px] py-[12px] rounded-[20px] border border-gray-300 focus:outline-none focus:border-[#1769FF] focus:ring-1 focus:ring-[#1769FF] transition-all resize-none text-[14px]"
      />
    ) : (
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="px-[20px] py-[12px] rounded-full border border-gray-300 focus:outline-none focus:border-[#1769FF] focus:ring-1 focus:ring-[#1769FF] transition-all text-[14px]"
      />
    )}
  </div>
);

export default Addnewitem;