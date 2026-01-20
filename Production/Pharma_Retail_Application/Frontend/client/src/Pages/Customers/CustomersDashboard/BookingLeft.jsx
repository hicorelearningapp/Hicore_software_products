// src/.../BookingLeft.jsx
import React from "react";
import deleteIcon from "../../../assets/Customers/SearchLabs/delete.png";
import calendarIcon from "../../../assets/Customers/SearchLabs/Calendar.png";
import clockIcon from "../../../assets/Customers/SearchLabs/Time.png";

/* Payment icons */
import walletIcon from "../../../assets/Customers/SearchLabs/wallet.png";
import cardIcon from "../../../assets/Customers/SearchLabs/card.png";
import codIcon from "../../../assets/Customers/SearchLabs/currency.png";
import bankIcon from "../../../assets/Customers/SearchLabs/bank.png";

const BookingLeft = ({ item }) => {
  const selectedTests = [
    {
      sno: 1,
      name: "CBC (Complete Blood Count)",
      prep: "Fasting Not Required",
      unitPrice: 250,
      gst: 50,
      total: 300,
    },
    {
      sno: 2,
      name: "Thyroid Profile (T3, T4, TSH)",
      prep: "Fasting Not Required",
      unitPrice: 700,
      gst: 170,
      total: 870,
    },
  ];

  const finalTotal = selectedTests.reduce((s, t) => s + t.total, 0);
  const format = (n) => `₹${Number(n).toFixed(2)}`;

  return (
    <>
      {/* -----------------------
          Selected Tests Container
          ----------------------- */}
      <div
        className="w-full rounded-xl overflow-hidden mb-4 bg-white"
        style={{ border: "1px solid #E6EDE6", borderRadius: 8 }}
      >
        {/* Header */}
        <div
          className="px-6 py-4"
          style={{
            background: "#E7EFEA",
            color: "#115D29",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <div className="text-lg font-semibold">Selected Tests</div>
        </div>

        <div style={{ borderTop: "1px solid #E6EDE6" }} />

        {/* Table */}
        <div className="w-full">
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  color: "#115D29",
                  fontWeight: 600,
                  borderBottom: "1px solid #E6EDE6",
                }}
              >
                <th
                  className="px-6 py-4 text-left text-sm"
                  style={{ width: 60 }}
                >
                  S.No
                </th>
                <th className="px-6 py-4 text-left text-sm">Test Name</th>
                <th
                  className="px-6 py-4 text-left text-sm"
                  style={{ width: 100 }}
                >
                  Preparation
                </th>
                <th
                  className="px-6 py-4 text-right text-sm"
                  style={{ width: 120 }}
                >
                  Unit Price
                </th>
                <th
                  className="px-6 py-4 text-right text-sm"
                  style={{ width: 120 }}
                >
                  GST(5%)
                </th>
                <th
                  className="px-6 py-4 text-right text-sm"
                  style={{ width: 120 }}
                >
                  Total
                </th>
                <th className="px-3 py-4" style={{ width: 48 }} />
              </tr>
            </thead>

            <tbody>
              {selectedTests.map((t, i) => (
                <tr key={i} style={{ verticalAlign: "top" }}>
                  <td
                    className="px-6 py-4 text-sm"
                    style={{ color: "#115D29" }}
                  >
                    {t.sno}
                  </td>

                  <td
                    className="py-4 text-sm"
                    style={{
                      color: "#115D29",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      lineHeight: 1.6,
                    }}
                  >
                    {t.name}
                  </td>

                  <td
                    className="px-6 py-4 text-sm"
                    style={{
                      color: "#115D29",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      lineHeight: 1.6,
                    }}
                  >
                    {t.prep}
                  </td>

                  <td
                    className="px-6 py-4 text-sm text-right"
                    style={{ color: "#115D29" }}
                  >
                    {format(t.unitPrice)}
                  </td>

                  <td
                    className="px-6 py-4 text-sm text-right"
                    style={{ color: "#115D29" }}
                  >
                    {format(t.gst)}
                  </td>

                  <td
                    className="px-6 py-4 text-sm text-right"
                    style={{ color: "#115D29" }}
                  >
                    {format(t.total)}
                  </td>

                  <td className="px-2 py-4 text-right">
                    <img
                      src={deleteIcon}
                      alt="delete"
                      className="w-5 h-5 cursor-pointer"
                      style={{
                        filter:
                          "invert(11%) sepia(78%) saturate(3528%) hue-rotate(336deg) brightness(98%) contrast(97%)",
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Test */}
        <div className="px-6 py-4">
          <button
            type="button"
            className="text-sm font-medium flex items-center gap-1"
            style={{
              color: "#2874BA",
              background: "transparent",
              border: "none",
            }}
          >
            <span>Add Test</span>
            <span className="text-lg">+</span>
          </button>
        </div>

        {/* Total */}
        <div
          className="px-6 py-4 text-right font-semibold"
          style={{
            borderTop: "1px solid #E6EDE6",
            color: "#115D29",
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            background: "white",
          }}
        >
          <span style={{ fontSize: 16 }}>Total: </span>
          <span style={{ fontSize: 16, marginLeft: 8 }}>{`₹${finalTotal.toFixed(
            2
          )}`}</span>
        </div>
      </div>

      {/* ---------------------------
          Patient Details Container
          --------------------------- */}
      <div
        className="w-full rounded-xl overflow-hidden bg-white"
        style={{ border: "1px solid #E6EDE6", borderRadius: 8 }}
      >
        <div
          className="px-6 py-4"
          style={{
            background: "#E7EFEA",
            color: "#115D29",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <div className="text-lg font-semibold">Patient Details</div>
        </div>

        <div style={{ borderTop: "1px solid #E6EDE6" }} />

        <div className="px-6 py-5">
          <div className="grid grid-cols-2 gap-3" style={{ color: "#115D29" }}>
            <div className="col-span-2">
              <label className="text-sm block mb-1">Patient Name</label>
              <input
                type="text"
                placeholder="e.g., Anita Sharma"
                className="w-full px-4 py-3 text-sm rounded-md"
                style={{
                  border: "1px solid #D9E8DC",
                  background: "#FBFDFB",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label className="text-sm block mb-1">Age</label>
              <input
                type="number"
                placeholder="Enter age"
                className="w-full px-4 py-3 text-sm rounded-md"
                style={{
                  border: "1px solid #D9E8DC",
                  background: "#FBFDFB",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label className="text-sm block mb-1">Gender</label>
              <select
                className="w-full px-4 py-3 text-sm rounded-md"
                style={{
                  border: "1px solid #F0ECEC",
                  background: "#FBF8F8",
                  outline: "none",
                  color: "#8A8A8A",
                  appearance: "none",
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Select option
                </option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm block mb-1">Contact Number</label>
              <input
                type="tel"
                placeholder="+91 Enter 10 digit Number"
                className="w-full px-4 py-3 text-sm rounded-md"
                style={{
                  border: "1px solid #D9E8DC",
                  background: "#FBFDFB",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label className="text-sm block mb-1">Email ID</label>
              <input
                type="email"
                placeholder="name@email.com"
                className="w-full px-4 py-3 text-sm rounded-md"
                style={{
                  border: "1px solid #D9E8DC",
                  background: "#FBFDFB",
                  outline: "none",
                }}
              />
            </div>

            <div className="col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm">Address</label>
                <a
                  href="#"
                  className="text-sm"
                  style={{
                    color: "#2874BA",
                    fontSize: 13,
                    textDecoration: "none",
                  }}
                >
                  Use GPS Location
                </a>
              </div>
              <input
                type="text"
                placeholder="Flat / Street / City / State / PIN Code"
                className="w-full px-4 py-3 text-sm rounded-md"
                style={{
                  border: "1px solid #D9E8DC",
                  background: "#FBFDFB",
                  outline: "none",
                }}
              />
            </div>

            <div className="col-span-2 mt-1">
              <button
                type="button"
                className="text-sm font-medium flex items-center gap-1"
                style={{
                  color: "#2874BA",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                }}
              >
                <span>Add Patient</span>
                <span className="text-lg">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------
          Sample Collection Details
          --------------------------- */}
      <div
        className="w-full rounded-xl overflow-hidden mt-4 bg-white"
        style={{ border: "1px solid #E6EDE6", borderRadius: 8 }}
      >
        <div
          className="px-6 py-4"
          style={{
            background: "#E7EFEA",
            color: "#115D29",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <div className="text-lg font-semibold">
            Sample Collection Details:
          </div>
        </div>

        <div style={{ borderTop: "1px solid #E6EDE6" }} />

        <div className="px-6 py-5" style={{ color: "#115D29" }}>
          <div className="grid grid-cols-2 gap-5 mb-6">
            {/* Test Date */}
            <div>
              <label className="text-sm block mb-1">Test Date</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Select Test Date"
                  className="w-full px-4 py-3 text-sm rounded-md"
                  style={{
                    border: "1px solid #D9E8DC",
                    background: "#FBFDFB",
                    paddingRight: 44,
                    color: "#9DBBAF",
                  }}
                />
                <img
                  src={calendarIcon}
                  alt="calendar"
                  className="absolute"
                  style={{
                    width: 18,
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    opacity: 0.8,
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="text-sm block mb-1">Time</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Select Time"
                  className="w-full px-4 py-3 text-sm rounded-md"
                  style={{
                    border: "1px solid #D9E8DC",
                    background: "#FBFDFB",
                    paddingRight: 44,
                    color: "#9DBBAF",
                  }}
                />
                <img
                  src={clockIcon}
                  alt="clock"
                  className="absolute"
                  style={{
                    width: 18,
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    opacity: 0.8,
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Radio buttons */}
          <div>
            <label className="text-sm block mb-3">
              Choose Sample Collection Mode
            </label>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sampleMode"
                  id="homeSample"
                  style={{ width: 18, height: 18, accentColor: "#115D29" }}
                />
                <span className="text-sm" style={{ color: "#115D29" }}>
                  Home Sample Collection
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sampleMode"
                  id="visitLab"
                  style={{ width: 18, height: 18, accentColor: "#115D29" }}
                />
                <span className="text-sm" style={{ color: "#115D29" }}>
                  Visit Lab
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------
          Payment Options
          --------------------------- */}
      <div
        className="w-full rounded-xl overflow-hidden mt-4 bg-white"
        style={{ border: "1px solid #E6EDE6", borderRadius: 8 }}
      >
        <div
          className="px-6 py-4"
          style={{
            background: "#E7EFEA",
            color: "#115D29",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <div className="text-lg font-semibold">Payment Options</div>
        </div>

        <div style={{ borderTop: "1px solid #E6EDE6" }} />

        <div className="grid grid-cols-2 gap-3 p-4">
          {/* UPI / Wallet */}
          <div
            className="flex justify-between items-center px-4 py-3 rounded-md"
            style={{
              border: "1px solid #D9E8DC",
              background: "#FFFFFF",
              color: "#115D29",
            }}
          >
            <div className="text-sm font-medium">
              UPI/Wallet (GPay, PhonePe)
            </div>
            <div
              className="flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: 6,
                background: "#115D29",
              }}
            >
              <img
                src={walletIcon}
                alt="wallet"
                style={{ width: 36, height: 36, objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Credit / Debit Card */}
          <div
            className="flex justify-between items-center px-4 py-3 rounded-md"
            style={{
              border: "1px solid #D9E8DC",
              background: "#FFFFFF",
              color: "#115D29",
            }}
          >
            <div className="text-sm font-medium">Credit / Debit Card</div>
            <div
              className="flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: 6,
                background: "#115D29",
              }}
            >
              <img
                src={cardIcon}
                alt="card"
                style={{ width: 36, height: 36, objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Cash on Delivery */}
          <div
            className="flex justify-between items-center px-4 py-3 rounded-md"
            style={{
              border: "1px solid #D9E8DC",
              background: "#FFFFFF",
              color: "#115D29",
            }}
          >
            <div className="text-sm font-medium">Cash on Delivery (COD)</div>
            <div
              className="flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: 6,
                background: "#115D29",
              }}
            >
              <img
                src={codIcon}
                alt="cod"
                style={{ width: 36, height: 36, objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Net Banking */}
          <div
            className="flex justify-between items-center px-4 py-3 rounded-md"
            style={{
              border: "1px solid #D9E8DC",
              background: "#FFFFFF",
              color: "#115D29",
            }}
          >
            <div className="text-sm font-medium">Net Banking</div>
            <div
              className="flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: 6,
                background: "#115D29",
              }}
            >
              <img
                src={bankIcon}
                alt="bank"
                style={{ width: 36, height: 36, objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingLeft;
