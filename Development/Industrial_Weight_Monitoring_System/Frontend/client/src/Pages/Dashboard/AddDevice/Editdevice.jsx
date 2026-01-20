import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const EditDevice = ({ item, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // Loading state for GET request
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    DeviceName: "",
    DeviceType: "",
    ConnectionMode: "",
    Capacity: 0,
    Battery: 0,
    Status: "",
    Notes: "",
    LocationName: "",
    Latitude: 0,
    Longitude: 0,
  });

  /* ---------- FETCH LATEST DATA (GET API) ---------- */
  useEffect(() => {
    const loadDeviceData = async () => {
      setFetching(true);
      try {
        const response = await axios.get(`${API_BASE}/devices/${item.DeviceId}`);
        if (response.data.success) {
          const d = response.data.data;
          setForm({
            DeviceName: d.DeviceName || "",
            DeviceType: d.DeviceType || "Scale",
            ConnectionMode: d.ConnectionMode || "Cable",
            Capacity: d.Capacity || 0,
            Battery: d.Battery || 0,
            Status: d.Status || "Online",
            Notes: d.Notes || "",
            LocationName: d.LocationName || "",
            Latitude: d.Latitude || 0,
            Longitude: d.Longitude || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch device details", error);
        alert("Could not load latest device data.");
      } finally {
        setFetching(false);
      }
    };

    loadDeviceData();
  }, [item.DeviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["Capacity", "Battery", "Latitude", "Longitude"];
    setForm((prev) => ({ 
      ...prev, 
      [name]: numericFields.includes(name) ? Number(value) : value 
    }));
  };

  /* ---------- UPDATE DATA (PUT API) ---------- */
  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        DeviceName: form.DeviceName,
        DeviceType: form.DeviceType,
        ConnectionMode: form.ConnectionMode,
        Capacity: Number(form.Capacity),
        Battery: Number(form.Battery),
        Status: form.Status,
        Notes: form.Notes,
        LocationName: form.LocationName,
        Latitude: Number(form.Latitude),
        Longitude: Number(form.Longitude)
      };

      const res = await axios.put(`${API_BASE}/devices/${item.DeviceId}`, payload);

      if (res.data.success) {
        setShowSuccess(true);
        onSuccess?.(); 
      }
    } catch (error) {
      console.error("Update failed", error);
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="fixed inset-0 z-[150] bg-black/60 flex items-center justify-center">
        <div className="bg-white p-8 rounded-[32px] font-bold text-[#1769FF] animate-pulse">
          Fetching Latest Configurations...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="flex flex-col w-full max-w-[800px] max-h-[90vh] bg-white rounded-[32px] p-6 md:p-10 shadow-2xl overflow-y-auto">
        
        <div className="mb-8">
          <h2 className="text-[24px] font-bold text-[#0A2A43]">Edit Device</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Field label="Device Name">
            <input name="DeviceName" value={form.DeviceName} onChange={handleChange} className="edit-input" />
          </Field>

          <Field label="Device Type">
            <select name="DeviceType" value={form.DeviceType} onChange={handleChange} className="edit-input">
              <option value="Scale">Scale</option>
              <option value="Sensor">Sensor</option>
            </select>
          </Field>

          <Field label="Capacity (g)">
            <input type="number" name="Capacity" value={form.Capacity} onChange={handleChange} className="edit-input" />
          </Field>

          <Field label="Connection Mode">
            <select name="ConnectionMode" value={form.ConnectionMode} onChange={handleChange} className="edit-input">
              <option value="Cable">Cable</option>
              <option value="WiFi">WiFi</option>
              <option value="Cellular">Cellular</option>
            </select>
          </Field>

          <Field label="Location">
            <input name="LocationName" value={form.LocationName} onChange={handleChange} className="edit-input" />
          </Field>

          <Field label="Battery Level (%)">
            <input type="number" name="Battery" value={form.Battery} onChange={handleChange} className="edit-input" />
          </Field>

          <div className="md:col-span-2">
            <Field label="Maintenance Notes">
              <textarea name="Notes" value={form.Notes} onChange={handleChange} rows="3" className="edit-input rounded-[20px] resize-none" />
            </Field>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={handleSave} disabled={loading} className="flex-1 py-4 bg-[#1769FF] text-white rounded-full font-bold">
            {loading ? "Updating..." : "Save Changes"}
          </button>
          <button onClick={onClose} className="flex-1 py-4 border border-gray-300 rounded-full font-bold">
            Cancel
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-[24px] p-10 text-center shadow-2xl">
            <h3 className="text-xl font-bold text-green-500 mb-4">Device Synchronized!</h3>
            <button onClick={() => { setShowSuccess(false); onClose(); }} className="px-8 py-3 bg-[#0A2A43] text-white rounded-full">
              Done
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .edit-input { width: 100%; border: 1px solid #E7EAEC; border-radius: 9999px; padding: 12px 20px; font-size: 14px; outline: none; }
        .edit-input:focus { border-color: #1769FF; }
      `}</style>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[12px] font-bold text-[#0A2A43] uppercase tracking-wider ml-4">{label}</label>
    {children}
  </div>
);

export default EditDevice;