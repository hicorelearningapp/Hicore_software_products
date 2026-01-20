import React, { useState } from "react";
import axios from "axios";
import uploadIcon from "../../../assets/Profile/Upload.png";

const BASE_URL = import.meta.env.VITE_API_BASE || "/api";

const Profile = () => {
  const [formData, setFormData] = useState({
    CompanyName: "",
    ContactPersonName: "",
    GSTNumber: "",
    LicenseNumber: "",
    PhoneNumber: "",
    Email: "",
    Password: "",
    AddressLine1: "",
    AddressLine2: "",
    City: "",
    State: "",
    Country: "",
    PostalCode: "",
    Latitude: "",
    Longitude: "",
    BankName: "",
    AccountNumber: "",
    IFSCCode: "",
    Branch: "",
  });

  const [companyPicture, setCompanyPicture] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCompanyPicture(e.target.files[0]);
    }
  };

  // Function to get Geolocation
  const getGeoLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          Latitude: position.coords.latitude,
          Longitude: position.coords.longitude,
        }));
      },
      (error) => {
        alert("Unable to retrieve location. Please allow location permissions.");
      }
    );
  };

  const handleSave = async () => {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (companyPicture) {
      data.append("CompanyPicture", companyPicture);
    }

    try {
      const response = await axios.post(`${BASE_URL}/distributors`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile Created Successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Check console for details.");
    }
  };

  return (
    <div className="px-6 py-4">
      <h2 className="text-xl font-semibold text-[#115D29]">Profile & Settings</h2>
      <p className="text-md text-gray-600 mt-3">Manage your business information and credentials</p>

      {/* ======================== COMPANY INFORMATION ======================== */}
      <div className="mt-6 border border-[#C7DECF] rounded-xl p-6 bg-white">
        <h3 className="text-lg font-semibold text-[#115D29] mb-6">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#115D29] mb-1">Distributor / Company Name *</label>
            <input type="text" name="CompanyName" value={formData.CompanyName} onChange={handleChange} className="w-full border text-[#115D29] border-[#C7DECF] rounded-lg px-3 py-2 outline-none" placeholder="Enter Company Name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#115D29] mb-1">Contact Person Name *</label>
            <input type="text" name="ContactPersonName" value={formData.ContactPersonName} onChange={handleChange} className="w-full border text-[#115D29] border-[#C7DECF] rounded-lg px-3 py-2 outline-none" placeholder="Enter Person Name" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-[#115D29] mb-1">GST Number</label>
            <input type="text" name="GSTNumber" value={formData.GSTNumber} onChange={handleChange} className="w-full border text-[#115D29] border-[#C7DECF] rounded-lg px-3 py-2 outline-none" placeholder="e.g., 27XXXXX1234X1Z5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#115D29] mb-1">License Number</label>
            <input type="text" name="LicenseNumber" value={formData.LicenseNumber} onChange={handleChange} className="w-full border text-[#115D29] border-[#C7DECF] rounded-lg px-3 py-2 outline-none" placeholder="e.g., DL-MH-2024-12345" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-[#115D29] mb-1">Email *</label>
            <input type="email" name="Email" value={formData.Email} onChange={handleChange} className="w-full border text-[#115D29] border-[#C7DECF] rounded-lg px-3 py-2 outline-none" placeholder="medicare@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#115D29] mb-1">Phone Number</label>
            <input type="text" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleChange} className="w-full border text-[#115D29] border-[#C7DECF] rounded-lg px-3 py-2 outline-none" placeholder="Enter 10 digit Mobile Number" />
          </div>
        </div>
      </div>

      {/* ======================== LOCATION DETAILS ======================== */}
      <div className="mt-6 border border-[#C7DECF] rounded-xl p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-[#115D29]">Location Details</h3>
          <button 
            type="button" 
            onClick={getGeoLocation}
            className="text-xs bg-[#115D29] text-white px-3 py-1 rounded hover:bg-opacity-90"
          >
            Get Current Coordinates
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#115D29] mb-1">Address Line 1 *</label>
            <input type="text" name="AddressLine1" value={formData.AddressLine1} onChange={handleChange} className="w-full border text-[#115D29] border-[#C7DECF] rounded-lg px-3 py-2 outline-none" placeholder="Street, House No." />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#115D29] mb-1">Address Line 2</label>
            <input type="text" name="AddressLine2" value={formData.AddressLine2} onChange={handleChange} className="w-full border text-[#115D29] border-[#C7DECF] rounded-lg px-3 py-2 outline-none" placeholder="Apartment, Suite, etc." />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-[#115D29] mb-1">City *</label>
            <input type="text" name="City" value={formData.City} onChange={handleChange} className="w-full border text-[#115D29] border-[#C7DECF] rounded-lg px-3 py-2 outline-none" placeholder="City" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#115D29] mb-1">State *</label>
            <input type="text" name="State" value={formData.State} onChange={handleChange} className="w-full border text-[#115D29] border-[#C7DECF] rounded-lg px-3 py-2 outline-none" placeholder="State" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#115D29] mb-1">Postal Code *</label>
            <input type="text" name="PostalCode" value={formData.PostalCode} onChange={handleChange} className="w-full border text-[#115D29] border-[#C7DECF] rounded-lg px-3 py-2 outline-none" placeholder="Zip Code" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-[#115D29]">
          <div>
            <label className="block text-sm font-medium mb-1">Country *</label>
            <input type="text" name="Country" value={formData.Country} onChange={handleChange} className="w-full border border-[#C7DECF] rounded-lg px-3 py-2 outline-none" placeholder="Country" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input type="number" name="Latitude" value={formData.Latitude} onChange={handleChange} className="w-full border border-[#C7DECF] rounded-lg px-3 py-2 outline-none bg-gray-50" placeholder="0.0000" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input type="number" name="Longitude" value={formData.Longitude} onChange={handleChange} className="w-full border border-[#C7DECF] rounded-lg px-3 py-2 outline-none bg-gray-50" placeholder="0.0000" />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm text-[#115D29] font-medium mb-1">Upload Company Picture</label>
          <input type="file" id="companyPic" className="hidden" onChange={handleFileChange} accept="image/*" />
          <button type="button" onClick={() => document.getElementById('companyPic').click()} className="w-full md:w-1/2 border border-[#115D29] rounded-lg flex items-center justify-center gap-3 py-2 font-medium text-[#115D29] hover:bg-green-50">
            <img src={uploadIcon} alt="upload" className="w-5 h-5" />
            {companyPicture ? companyPicture.name : "Upload Image"}
          </button>
        </div>
      </div>

      {/* ======================== BANK DETAILS ======================== */}
      <div className="mt-6 border border-[#C7DECF] rounded-xl p-6 bg-white">
        <h3 className="text-lg font-semibold text-[#115D29] mb-6">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#115D29] mb-1">Bank Name</label>
            <input type="text" name="BankName" value={formData.BankName} onChange={handleChange} className="w-full border text-[#115D29] border-[#C7DECF] rounded-lg px-3 py-2 outline-none" placeholder="Enter Bank Name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#115D29] mb-1">Account Number</label>
            <input type="text" name="AccountNumber" value={formData.AccountNumber} onChange={handleChange} className="w-full border text-[#115D29] border-[#C7DECF] rounded-lg px-3 py-2 outline-none" placeholder="Enter Account Number" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-[#115D29] mb-1">IFSC Code</label>
            <input type="text" name="IFSCCode" value={formData.IFSCCode} onChange={handleChange} className="w-full border text-[#115D29] border-[#C7DECF] rounded-lg px-3 py-2 outline-none" placeholder="e.g., SBIN0001234" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#115D29] mb-1">Branch</label>
            <input type="text" name="Branch" value={formData.Branch} onChange={handleChange} className="w-full border text-[#115D29] border-[#C7DECF] rounded-lg px-3 py-2 outline-none" placeholder="Enter Branch Name" />
          </div>
        </div>
      </div>

      {/* ======================== CREDENTIALS (PASSWORD) ======================== */}
      <div className="mt-6 border border-[#C7DECF] rounded-xl p-6 bg-white">
        <h3 className="text-lg font-semibold text-[#115D29] mb-6">Account Credentials</h3>
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium text-[#115D29] mb-1">Account Password *</label>
          <input type="password" name="Password" value={formData.Password} onChange={handleChange} className="w-full border text-[#115D29] border-[#C7DECF] rounded-lg px-3 py-2 outline-none" placeholder="Enter secure password" />
        </div>
      </div>

      {/* ======================== SETTINGS & NOTIFICATIONS ======================== */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="border border-[#C7DECF] rounded-xl p-6 bg-white">
          <h3 className="text-lg font-semibold text-[#115D29] mb-6">Settings</h3>
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-[#115D29]">Dynamic Pricing</div>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 rounded-full bg-gray-200 peer-checked:bg-blue-600 relative transition-colors">
                <span className="block w-5 h-5 bg-white rounded-full shadow transform translate-x-0 peer-checked:translate-x-5 transition-transform absolute top-0.5 left-0.5" />
              </div>
            </label>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-[#115D29]">Auto Reorder</div>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 rounded-full bg-gray-200 peer-checked:bg-blue-600 relative transition-colors">
                <span className="block w-5 h-5 bg-white rounded-full shadow transform translate-x-0 peer-checked:translate-x-5 transition-transform absolute top-0.5 left-0.5" />
              </div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#115D29]">Alert when stock &lt; threshold</div>
            <input type="number" className="w-28 border text-[#115D29] border-[#C7DECF] rounded-lg px-3 py-2 outline-none text-sm" placeholder="Enter Value" />
          </div>
        </div>

        <div className="border border-[#C7DECF] rounded-xl p-6 bg-white">
          <h3 className="text-lg font-semibold text-[#115D29] mb-6">Notifications</h3>
          <div className="flex items-start gap-3 mb-4">
            <input id="orderAlerts" type="checkbox" className="w-4 h-4 border border-[#C7DECF] rounded-sm focus:ring-0" />
            <label htmlFor="orderAlerts" className="text-sm text-[#115D29]">Order Alerts</label>
          </div>
          <div className="flex items-start gap-3 mb-4">
            <input id="paymentReminders" type="checkbox" className="w-4 h-4 border border-[#C7DECF] rounded-sm focus:ring-0" />
            <label htmlFor="paymentReminders" className="text-sm text-[#115D29]">Payment Reminders</label>
          </div>
          <div className="flex items-start gap-3">
            <input id="expiryNotifications" type="checkbox" className="w-4 h-4 border border-[#C7DECF] rounded-sm focus:ring-0" />
            <label htmlFor="expiryNotifications" className="text-sm text-[#115D29]">Expiry Notifications</label>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end mt-6 mb-10">
        <button onClick={handleSave} className="bg-[#115D29] text-white px-8 py-2 rounded-lg hover:bg-[#0d4a20] transition">Save</button>
      </div>
    </div>
  );
};

export default Profile;