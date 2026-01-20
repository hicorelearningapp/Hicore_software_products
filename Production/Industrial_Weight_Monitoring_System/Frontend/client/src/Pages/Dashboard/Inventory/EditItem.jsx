import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const EditItem = ({ item, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize form using the item data passed from ItemDetails
  const [form, setForm] = useState({
    itemName: item.ItemName || "",
    category: item.Category || "",
    description: item.Description || "",
    unitWeight: item.PerUnitWeight || 0,
    minThreshold: item.MinThreshold || 0,
    maxThreshold: item.MaxThreshold || 0,
    measurement: item.Measurement?.toLowerCase() === "gram" ? "gram" : "count",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);

    // Payload aligned exactly with your PUT /items/{item_id} schema
    const payload = {
      ItemName: form.itemName,
      Category: form.category,
      Description: form.description,
      PerUnitWeight: Number(form.unitWeight),
      Measurement: form.measurement,
      MinThreshold: Number(form.minThreshold),
      MaxThreshold: Number(form.maxThreshold)
    };

    try {
      const response = await axios.put(`${API_BASE}/items/${item.ItemId}`, payload);
      
      if (response.data.success) {
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update item: " + (error.response?.data?.message || "Server Error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-[16px]">
      <div className="flex flex-col w-full max-w-[700px] max-h-[90vh] overflow-y-auto bg-white rounded-[32px] p-[24px] sm:p-[36px] gap-[24px] shadow-2xl">
        
        <div className="flex justify-between items-center">
          <h2 className="text-[20px] font-bold text-[#0A2A43]">
            Edit Product Specifications
          </h2>
          <span className="text-[12px] bg-gray-100 px-3 py-1 rounded-full font-mono text-gray-500">
            Item ID: {item.ItemId}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-[20px]">
          <Field label="Item Name">
            <input
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
              className="w-full rounded-full border border-gray-300 px-5 py-3 text-[14px] focus:border-[#1769FF] outline-none transition-colors"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
            <Field label="Category">
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-full border border-gray-300 px-5 py-3 text-[14px] focus:border-[#1769FF] outline-none"
              />
            </Field>

            {/* Measurement Unit Radio Buttons */}
            <Field label="Measurement Unit">
              <div className="flex items-center gap-6 px-2 py-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="measurement"
                    value="count"
                    checked={form.measurement === "count"}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#1769FF] focus:ring-[#1769FF]"
                  />
                  <span className="text-[14px] text-[#0A2A43] group-hover:text-[#1769FF] transition-colors">Count</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="measurement"
                    value="gram"
                    checked={form.measurement === "gram"}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#1769FF] focus:ring-[#1769FF]"
                  />
                  <span className="text-[14px] text-[#0A2A43] group-hover:text-[#1769FF] transition-colors">Gram</span>
                </label>
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px]">
            <Field label="Weight per Unit (g)">
              <input
                type="number"
                name="unitWeight"
                value={form.unitWeight}
                onChange={handleChange}
                className="w-full rounded-full border border-gray-300 px-5 py-3 text-[14px] focus:border-[#1769FF] outline-none"
              />
            </Field>
            <Field label="Min Threshold">
              <input
                type="number"
                name="minThreshold"
                value={form.minThreshold}
                onChange={handleChange}
                className="w-full rounded-full border border-gray-300 px-5 py-3 text-[14px] focus:border-[#1769FF] outline-none"
              />
            </Field>
            <Field label="Max Threshold">
              <input
                type="number"
                name="maxThreshold"
                value={form.maxThreshold}
                onChange={handleChange}
                className="w-full rounded-full border border-gray-300 px-5 py-3 text-[14px] focus:border-[#1769FF] outline-none"
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-[20px] border border-gray-300 px-5 py-3 text-[14px] focus:border-[#1769FF] outline-none resize-none"
            />
          </Field>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-[12px] pt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 h-[52px] rounded-full bg-[#1769FF] text-white font-bold hover:bg-[#1255CC] disabled:opacity-50 transition-all shadow-lg shadow-blue-100"
          >
            {loading ? "Updating..." : "Update Item"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-[52px] rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-[400px] bg-white rounded-[32px] p-8 text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-[#0A2A43] mb-2">Success!</h3>
            <p className="text-gray-500 mb-8">
              The item properties and measurement unit have been successfully updated.
            </p>
            <button
              onClick={() => {
                setShowSuccess(false);
                onSave(); 
              }}
              className="w-full py-4 bg-[#0A2A43] text-white rounded-full font-bold hover:bg-black transition-colors"
            >
              Back to Inventory
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[13px] font-bold text-[#0A2A43] ml-2 uppercase tracking-tight opacity-70">
      {label}
    </label>
    {children}
  </div>
);

export default EditItem;