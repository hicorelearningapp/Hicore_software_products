import React, { useState } from "react";
import uploadIcon from "../../../assets/Profile/Upload.png";
import { registerRetailer } from "../RetailersDashboard/retailerApi";

const Profile = () => {
  const [formData, setFormData] = useState({
    ShopName: "",
    OwnerName: "",
    GSTNumber: "",
    LicenseNumber: "",
    PhoneNumber: "",
    Email: "",
    AddressLine1: "",
    AddressLine2: "",
    City: "",
    State: "",
    Country: "",
    PostalCode: "",
    Latitude: "",
    Longitude: "",
    ShopPic: "",
    BankName: "",
    AccountNumber: "",
    IFSCCode: "",
    Branch: "",
    Password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, ShopPic: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData({
          ...formData,
          Latitude: pos.coords.latitude.toString(),
          Longitude: pos.coords.longitude.toString(),
        });
      },
      (err) => {
        alert("Location permission denied");
      }
    );
  };

  const handleSubmit = async () => {
    const result = await registerRetailer(formData);
    console.log("Response:", result);

    if (result) alert("Retailer Created Successfully!");
    else alert("Something went wrong");
  };

  return (
    <div className="px-6 py-4">
      <h2 className="text-xl font-semibold text-[#115D29]">
        Profile & Settings
      </h2>

      <p className="text-md text-gray-600 mt-3">
        Manage your business information and credentials
      </p>

      {/* Business Info */}
      <div className="mt-8 border border-gray-300 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-[#115D29] mb-6">
          Business Information
        </h3>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Shop Name */}
          <div>
            <label className="text-sm text-[#115D29]">Shop Name</label>
            <input
              name="ShopName"
              value={formData.ShopName}
              onChange={handleChange}
              type="text"
              placeholder="Enter Shop Name"
              className="mt-2 w-full text-[#115D29] border border-[#C7DECF] rounded-md px-4 py-2"
            />
          </div>

          {/* Owner Name */}
          <div>
            <label className="text-sm text-[#115D29]">Owner Name</label>
            <input
              name="OwnerName"
              value={formData.OwnerName}
              onChange={handleChange}
              type="text"
              placeholder="Enter Owner Name"
              className="mt-2 w-full text-[#115D29] border border-[#C7DECF] rounded-md px-4 py-2"
            />
          </div>

          {/* GST */}
          <div>
            <label className="text-sm text-[#115D29]">GST Number</label>
            <input
              name="GSTNumber"
              value={formData.GSTNumber}
              onChange={handleChange}
              type="text"
              placeholder="e.g. 27XXXXX1234X1Z5"
              className="mt-2 w-full text-[#115D29] border border-[#C7DECF] rounded-md px-4 py-2"
            />
          </div>

          {/* License */}
          <div>
            <label className="text-sm text-[#115D29]">Drug License Number</label>
            <input
              name="LicenseNumber"
              value={formData.LicenseNumber}
              onChange={handleChange}
              type="text"
              placeholder="DL-MH-2024-12345"
              className="mt-2 w-full text-[#115D29] border border-[#C7DECF] rounded-md px-4 py-2"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-[#115D29]">Email</label>
            <input
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              type="email"
              placeholder="medicare@example.com"
              className="mt-2 w-full text-[#115D29] border border-[#C7DECF] rounded-md px-4 py-2"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-[#115D29]">Phone Number</label>
            <input
              name="PhoneNumber"
              value={formData.PhoneNumber}
              onChange={handleChange}
              type="text"
              placeholder="Enter 10 Digit Number"
              className="mt-2 w-full text-[#115D29] border border-[#C7DECF] rounded-md px-4 py-2"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-sm text-[#115D29]">Address Line 1</label>
            <input
              name="AddressLine1"
              value={formData.AddressLine1}
              onChange={handleChange}
              type="text"
              placeholder="Street / Building"
              className="mt-2 w-full text-[#115D29] border border-[#C7DECF] rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="text-sm text-[#115D29]">Address Line 2</label>
            <input
              name="AddressLine2"
              value={formData.AddressLine2}
              onChange={handleChange}
              type="text"
              placeholder="Area / Landmark"
              className="mt-2 w-full text-[#115D29] border border-[#C7DECF] rounded-md px-4 py-2"
            />
          </div>

          {/* City */}
          <div>
            <label className="text-sm text-[#115D29]">City</label>
            <input
              name="City"
              value={formData.City}
              onChange={handleChange}
              type="text"
              placeholder="Enter City"
              className="mt-2 w-full text-[#115D29] border border-[#C7DECF] rounded-md px-4 py-2"
            />
          </div>

          {/* State */}
          <div>
            <label className="text-sm text-[#115D29]">State</label>
            <input
              name="State"
              value={formData.State}
              onChange={handleChange}
              type="text"
              placeholder="Enter State"
              className="mt-2 w-full text-[#115D29] border border-[#C7DECF] rounded-md px-4 py-2"
            />
          </div>

          {/* Country */}
          <div>
            <label className="text-sm text-[#115D29]">Country</label>
            <input
              name="Country"
              value={formData.Country}
              onChange={handleChange}
              type="text"
              placeholder="India"
              className="mt-2 w-full text-[#115D29] border border-[#C7DECF] rounded-md px-4 py-2"
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="text-sm text-[#115D29]">Postal Code</label>
            <input
              name="PostalCode"
              value={formData.PostalCode}
              onChange={handleChange}
              type="text"
              placeholder="600001"
              className="mt-2 w-full text-[#115D29] border border-[#C7DECF] rounded-md px-4 py-2"
            />
          </div>

          {/* Latitude */}
          <div>
            <label className="text-sm text-[#115D29]">Latitude</label>
            <input
              name="Latitude"
              value={formData.Latitude}
              onChange={handleChange}
              type="text"
              placeholder="12.9716"
              className="mt-2 w-full text-[#115D29] border border-[#C7DECF] rounded-md px-4 py-2"
            />
          </div>

          {/* Longitude */}
          <div>
            <label className="text-sm text-[#115D29]">Longitude</label>
            <input
              name="Longitude"
              value={formData.Longitude}
              onChange={handleChange}
              type="text"
              placeholder="77.5946"
              className="mt-2 w-full text-[#115D29] border border-[#C7DECF] rounded-md px-4 py-2"
            />

            <button
              onClick={getLocation}
              className="mt-3 w-full bg-[#115D29] text-white py-2 rounded-md hover:bg-green-900"
            >
              Get Current Location
            </button>
          </div>
        </div>

        {/* Image Upload */}
        <div className="mt-6">
          <label className="text-sm text-[#115D29]">Upload Shop Picture</label>

          <label className="mt-3 w-full cursor-pointer border border-[#115D29] rounded-md py-3 flex items-center justify-center gap-3 text-[#115D29] font-medium hover:bg-green-50">
            <img src={uploadIcon} alt="upload" className="w-5 h-5" />
            Upload Image
            <input type="file" className="hidden" onChange={handleImage} />
          </label>
        </div>
      </div>

      {/* BANK */}
      <div className="mt-8 border border-gray-300 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-[#115D29] mb-6">Bank Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-[#115D29]">Bank Name</label>
            <input
              name="BankName"
              value={formData.BankName}
              onChange={handleChange}
              type="text"
              className="mt-2 w-full border border-[#C7DECF] rounded-md px-4 py-2 text-[#115D29]"
            />
          </div>

          <div>
            <label className="text-sm text-[#115D29]">Account Number</label>
            <input
              name="AccountNumber"
              value={formData.AccountNumber}
              onChange={handleChange}
              type="text"
              className="mt-2 w-full border border-[#C7DECF] rounded-md px-4 py-2 text-[#115D29]"
            />
          </div>

          <div>
            <label className="text-sm text-[#115D29]">IFSC Code</label>
            <input
              name="IFSCCode"
              value={formData.IFSCCode}
              onChange={handleChange}
              type="text"
              className="mt-2 w-full border border-[#C7DECF] rounded-md px-4 py-2 text-[#115D29]"
            />
          </div>

          <div>
            <label className="text-sm text-[#115D29]">Branch</label>
            <input
              name="Branch"
              value={formData.Branch}
              onChange={handleChange}
              type="text"
              className="mt-2 w-full border border-[#C7DECF] rounded-md px-4 py-2 text-[#115D29]"
            />
          </div>
        </div>
      </div>

      {/* PASSWORD */}
      <div className="mt-8 border border-gray-300 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-[#115D29] mb-6">Password</h3>

        <div>
          <label className="text-sm text-[#115D29]">Password</label>
          <input
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            type="password"
            className="mt-2 w-full border border-[#C7DECF] rounded-md px-4 py-2 text-[#115D29]"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-[#115D29] text-white py-3 rounded-md font-medium hover:bg-green-900"
      >
        Submit
      </button>
    </div>
  );
};

export default Profile;
