import React from "react";
import healthIcon from "../../../../assets/CustomerOrder/health-icon.png";
import closeIcon from "../../../../assets/CustomerOrder/close-icon.png";

const InvoiceBody = ({ onClose }) => {
  return (
    // Outer wrapper (positions the floating close icon)
    <div className="relative w-full p-2">
      {/* Floating close button placed outside the inner border */}
      {typeof onClose === "function" && (
        <button
          onClick={onClose}
          aria-label="Close invoice"
          className="absolute -top-8 right-0 z-20 w-9 h-9 flex items-center "
        >
          <img src={closeIcon} alt="close" className="w-6 h-6" />
        </button>
      )}

      {/* Inner bordered invoice container */}
      <div className="border border-gray-300 rounded-md p-6 bg-white">
        {/* Top Section */}
        <div className="flex justify-between items-start">
          {/* Left Section - Icon + HealthPlus */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <img
                src={healthIcon}
                alt="HealthPlus Icon"
                className="w-10 h-10"
              />
              <h1 className="text-xl font-semibold text-green-800">
                HealthPlus
              </h1>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-green-800">
              Invoice / Bill of Sale
            </h2>
          </div>

          {/* Right Section - Invoice Number */}
          <div>
            <p className="text-green-800 font-semibold">
              Invoice No: <span className="font-bold">INV-2025-38216</span>
            </p>
          </div>
        </div>

        {/* ====================== Customer Details Section ====================== */}
        <div className="mt-8 border border-gray-200 rounded-lg">
          {/* Heading Bar */}
          <div className="bg-green-50 px-5 py-3 border-b border-gray-200 rounded-t-lg">
            <h3 className="text-green-900 font-semibold text-lg">
              Customer Details
            </h3>
          </div>

          {/* Content */}
          <div className="p-5 text-sm text-green-900 grid grid-cols-2">
            {/* Left Side */}
            <div className="flex flex-col gap-3">
              <p className="font-semibold">Anita Sharma</p>

              <p>
                23, Green View Apartments, Sector 14, Gurugram,
                <br />
                Haryana – 122001
              </p>

              <p>Contact: +91 98765 43210</p>

              <p>Email: anita.sharma@email.com</p>
            </div>

            {/* Right Side */}
            <div className="flex flex-col gap-3 text-right">
              <p>
                Order ID: <span className="font-bold">ORD-38216</span>
              </p>

              <p>
                Order Date: <span className="font-bold">29/10/2025</span>
              </p>

              <p>
                Expected Delivery: <span className="font-bold">05/11/2025</span>
              </p>
            </div>
          </div>
        </div>

        {/* ====================== Order Summary Section ====================== */}
        <div className="mt-6 border border-gray-200 rounded-lg">
          {/* Heading Bar */}
          <div className="bg-green-50 px-5 py-3 border-b border-gray-200 rounded-t-lg">
            <h3 className="text-green-900 font-semibold text-lg">
              Order Summary
            </h3>
          </div>

          {/* Inner padded area that contains the table */}
          <div className="p-5">
            <div className="border border-green-100 rounded-md overflow-hidden">
              <table className="w-full text-sm text-green-800">
                <thead className="bg-white">
                  <tr className="text-left">
                    <th className="px-6 py-4 w-1/12 font-semibold">S.No</th>
                    <th className="px-6 py-4 font-semibold">Medicine</th>
                    <th className="px-6 py-4 w-2/12 font-semibold">Quantity</th>
                    <th className="px-6 py-4 w-2/12 font-semibold">
                      Unit Price
                    </th>
                    <th className="px-6 py-4 w-2/12 font-semibold">GST(5%)</th>
                    <th className="px-6 py-4 w-2/12 font-semibold">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {/* Row 1 */}
                  <tr className="border-t border-green-100">
                    <td className="px-6 py-6 align-top">1</td>
                    <td className="px-6 py-6">
                      <div>Paracetamol</div>
                      <div className="text-xs mt-1">500mg</div>
                    </td>
                    <td className="px-6 py-6 text-center">2</td>
                    <td className="px-6 py-6">₹50.00</td>
                    <td className="px-6 py-6">₹5.00</td>
                    <td className="px-6 py-6">₹50.00</td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="border-t border-green-100">
                    <td className="px-6 py-6 align-top">2</td>
                    <td className="px-6 py-6">
                      <div>Amoxicilin</div>
                      <div className="text-xs mt-1">250mg</div>
                    </td>
                    <td className="px-6 py-6 text-center">1</td>
                    <td className="px-6 py-6">₹80.00</td>
                    <td className="px-6 py-6">₹4.00</td>
                    <td className="px-6 py-6">₹84.00</td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="border-t border-green-100">
                    <td className="px-6 py-6 align-top">3</td>
                    <td className="px-6 py-6">
                      <div>Cetrizine</div>
                      <div className="text-xs mt-1">10mg</div>
                    </td>
                    <td className="px-6 py-6 text-center">1</td>
                    <td className="px-6 py-6">₹55.00</td>
                    <td className="px-6 py-6">₹2.00</td>
                    <td className="px-6 py-6">₹57.00</td>
                  </tr>

                  {/* Total row */}
                  <tr className="border-t border-green-100">
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-right font-semibold"
                    >
                      Total:
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-900">
                      ₹250.00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ====================== Payment & Delivery Section ====================== */}
        <div className="mt-6 border border-gray-200 rounded-lg">
          {/* Heading Bar */}
          <div className="bg-green-50 px-5 py-3 border-b border-gray-200 rounded-t-lg">
            <h3 className="text-green-900 font-semibold text-lg">
              Payment &amp; Delivery
            </h3>
          </div>

          {/* Content */}
          <div className="p-5 text-sm text-green-900">
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-3">
                <p>
                  <span className="font-medium">Payment Mode: </span>
                  <span className="font-semibold">Online (Prepaid)</span>
                </p>

                <p>
                  <span className="font-medium">Payment Status: </span>
                  <span className="font-semibold">Successful</span>
                </p>
              </div>

              {/* Right Column */}
              <div className="space-y-3 text-right">
                <p>
                  <span className="font-medium">Delivery Method: </span>
                  <span className="font-semibold">Home Delivery</span>
                </p>

                <p>
                  <span className="font-medium">Delivery Partner: </span>
                  <span className="font-semibold">
                    Partner Delivery Service
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ====================== Notes Section ====================== */}
        <div className="mt-6 border border-gray-200 rounded-lg">
          {/* Heading Bar */}
          <div className="bg-green-50 px-5 py-3 border-b border-gray-200 rounded-t-lg">
            <h3 className="text-green-900 font-semibold text-lg">Notes</h3>
          </div>

          {/* Notes Content */}
          <div className="p-5 text-sm text-green-900">
            <ul className="list-disc pl-6 space-y-4 leading-relaxed">
              <li>
                All medicines are sold under valid license and verified
                prescriptions.
              </li>
              <li>Prices include applicable taxes (GST @5%).</li>
              <li>
                For replacement or issues, contact support within 24 hours of
                delivery.
              </li>
            </ul>
          </div>
        </div>

        {/* ====================== Distributor Details Section ====================== */}
        <div className="mt-6 border border-gray-200 rounded-lg">
          {/* Heading Bar */}
          <div className="bg-green-50 px-5 py-3 border-b border-gray-200 rounded-t-lg">
            <h3 className="text-green-900 font-semibold text-lg">
              Distributor Details
            </h3>
          </div>

          {/* Content */}
          <div className="p-5 text-sm text-green-900 grid grid-cols-2 gap-6 items-start">
            {/* Left Column */}
            <div className="space-y-3">
              <p>
                <span className="font-medium">Retailer Name: </span>
                <span className="font-semibold">HealthPlus</span>
              </p>
              <p>
                <span className="font-medium">Address: </span>
                <span className="font-semibold">
                  Plot 42, Industrial Area, Gurugram, Haryana
                </span>
              </p>
              <p>
                <span className="font-medium">Support: </span>
                <span className="font-semibold">
                  +91 90000 11223 | support@healthplus.in
                </span>
              </p>
            </div>

            {/* Right Column */}
            <div className="space-y-3 text-right">
              <p>
                <span className="font-medium">License No: </span>
                <span className="font-semibold">PH-478920</span>
              </p>
              <p>
                <span className="font-medium">GSTIN: </span>
                <span className="font-semibold">06ABCDE1234F1Z8</span>
              </p>
            </div>
          </div>
        </div>

        {/* ====================== Thank You Footer ====================== */}
        <div className="mt-8 text-center">
          <h4 className="text-green-900 font-semibold text-lg">
            Thank you for choosing HealthPlus!
          </h4>
          <p className="text-gray-500 mt-2">Stay Healthy. Stay Safe.</p>
        </div>
      </div>

      {/* ---------------- Buttons outside the inner bordered container ----------------
          These buttons sit below the bordered invoice box (outside its border),
          aligned horizontally similar to the provided image.
      */}
      <div className="mt-4 flex gap-4">
        <button
          type="button"
          className="flex-1 bg-[#115D29] text-white font-semibold py-3 rounded-md shadow-sm"
        >
          Share Invoice
        </button>

        <button
          type="button"
          className="flex-1 border border-[#115D29] text-[#115D29] font-semibold py-3 rounded-md bg-white"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoiceBody;
