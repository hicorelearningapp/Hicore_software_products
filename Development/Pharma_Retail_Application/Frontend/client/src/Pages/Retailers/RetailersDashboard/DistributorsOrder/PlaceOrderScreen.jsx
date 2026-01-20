// PlaceOrderScreen.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

// icons
import backIcon from "../../../../assets/DistributorPage/CircleArrow.png";
import searchIcon from "../../../../assets/DistributorPage/Search.png";
import dropdownIcon from "../../../../assets/DistributorPage/down-icon.png";
import removeIcon from "../../../../assets/DistributorPage/Drop-icon.png";
import bestPriceIcon from "../../../../assets/DistributorPage/right.png";
import calendarIcon from "../../../../assets/DistributorPage/Calendar.png";
import locationIcon from "../../../../assets/DistributorPage/Location.png";
import successIcon from "../../../../assets/DistributorPage/Party.png";
import closeIcon from "../../../../assets/DistributorPage/Drop-icon.png";

// Backend Link Configuration
const BASE_URL = import.meta.env.VITE_API_BASE || "/api";

const convertDMYtoISO = (dmY) => {
  if (!dmY) return "";
  const parts = dmY.trim().split("/");
  if (parts.length === 3) {
    const [d, m, y] = parts;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return "";
};

const formatISOtoDMY = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const PlaceOrderScreen = ({ onClose }) => {
  const [deliveryMode, setDeliveryMode] = useState("door");
  const [paymentMode, setPaymentMode] = useState("online");
  const [notify, setNotify] = useState(false);

  // --- DYNAMIC STATE ---
  const [selectedDistributors, setSelectedDistributors] = useState([]);
  const [distInput, setDistInput] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [tempMedicine, setTempMedicine] = useState("");
  const [tempQty, setTempQty] = useState("");
  const [tempRate, setTempRate] = useState("");

  const [orderDateISO, setOrderDateISO] = useState(() => convertDMYtoISO("29/10/2025"));
  const [expectedDateISO, setExpectedDateISO] = useState(() => convertDMYtoISO("05/11/2025"));
  const [orderDisplay, setOrderDisplay] = useState("29/10/2025");
  const [expectedDisplay, setExpectedDisplay] = useState("05/11/2025");

  const [locationText] = useState("Google address");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orderDateNativeRef = useRef(null);
  const expectedDateNativeRef = useRef(null);

  const handleAddMedicine = () => {
    if (tempMedicine.trim() && tempQty && tempRate) {
      const lastDistObj = selectedDistributors[selectedDistributors.length - 1];
      const targetDistName = lastDistObj ? lastDistObj.name : "Unassigned Distributor";
      const targetDistId = lastDistObj ? lastDistObj.id : 1;
      
      const qty = parseFloat(tempQty);
      const rate = parseFloat(tempRate);
      
      setMedicines([
        ...medicines,
        {
          MedicineId: Math.floor(Math.random() * 1000) + 1, 
          MedicineName: tempMedicine.trim(),
          Quantity: qty,
          UnitPrice: rate,
          TotalAmount: qty * rate,
          DistributorName: targetDistName,
          DistributorId: targetDistId,
          RetailerId: 1,
          RetailerName: "medical", 
          GSTPercentage: 0, 
        },
      ]);
      setTempMedicine("");
      setTempQty("");
      setTempRate("");
    }
  };

  const handlePlaceOrder = async () => {
    if (medicines.length === 0) {
      alert("Please add at least one medicine.");
      return;
    }

    setIsSubmitting(true);
    const totalAmount = medicines.reduce((sum, m) => sum + m.TotalAmount, 0);

    // DYNAMIC PAYLOAD: Ensuring all types match your JSON schema (Strings for names, Numbers for IDs)
    const payload = {
      order: {
        RetailerId: 1, // Number
        RetailerName: "medical", // String (added to fix NOT NULL error)
        DistributorId: Number(medicines[0]?.DistributorId) || 1, // Number
        DistributorName: String(medicines[0]?.DistributorName) || "medical", // String
        OrderDateTime: new Date(orderDateISO).toISOString(),
        ExpectedDelivery: new Date(expectedDateISO).toISOString(),
        DeliveryMode: String(deliveryMode),
        DeliveryService: "standard_service",
        DeliveryPartnerTrackingId: "not_assigned",
        DeliveryStatus: "Pending",
        PaymentMode: String(paymentMode),
        PaymentStatus: "Pending",
        PaymentTransactionId: "sample_trans_123",
        Amount: Number(totalAmount),
        InvoiceId: "INV_SAMPLE_001",
        OrderStage: "Created",
        OrderStatus: "Pending",
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString()
      },
      items: medicines.map(item => ({
        OrderId: 1, // Number
        RetailerId: 1, // Number
        RetailerName: "medical", // String
        DistributorId: Number(item.DistributorId) || 1, // Number
        DistributorName: String(item.DistributorName), // String
        MedicineId: Number(item.MedicineId) || 1, // Number
        MedicineName: String(item.MedicineName), // String
        Quantity: Number(item.Quantity), // Number
        UnitPrice: Number(item.UnitPrice), // Number
        GSTPercentage: Number(item.GSTPercentage), // Number
        TotalAmount: Number(item.TotalAmount) // Number
      }))
    };

    try {
      const response = await axios.post(`${BASE_URL}/retailer/orders`, payload);
      if (response.status === 200 || response.status === 201) {
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Order placement failed:", error.response?.data || error.message);
      alert(error.response?.data?.detail || "Server Error: Database constraint failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDistKeyDown = (e) => {
    if (e.key === "Enter" && distInput.trim() !== "") {
      const distName = distInput.trim();
      if (!selectedDistributors.some(d => d.name === distName)) {
        const newDist = {
          id: selectedDistributors.length + 1,
          name: distName
        };
        setSelectedDistributors([...selectedDistributors, newDist]);
      }
      setDistInput("");
    }
  };

  const removeDistributor = (name) => {
    setSelectedDistributors(selectedDistributors.filter((d) => d.name !== name));
    setMedicines(medicines.filter((m) => m.DistributorName !== name));
  };

  const Radio = ({ id, name, checked, onChange, label }) => (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none" onClick={() => onChange()}>
      <span className={"w-5 h-5 rounded-full flex items-center justify-center border " + (checked ? "border-green-600 bg-green-600" : "border-[#C7DECF] bg-white")}>
        {checked && <span className="w-2 h-2 rounded-full bg-white block" />}
      </span>
      <span className="text-[#115D29] text-sm">{label}</span>
      <input id={id} name={name} type="radio" checked={checked} onChange={() => onChange()} className="sr-only" />
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto p-6 scrollbar-hide">
      <button onClick={onClose} className="flex items-center gap-2 text-[#115D29] text-lg">
        <img src={backIcon} alt="back" className="w-5 h-5" /> Back
      </button>

      <h1 className="text-2xl font-semibold text-[#115D29] mt-4">Place an Order</h1>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-[#B5CDBD] rounded-lg p-6 bg-white">
          <h2 className="text-[#115D29] text-lg font-semibold mb-6">Place Order</h2>

          <label className="text-[#115D29] text-sm font-semibold">Choose Distributor (Type & Press Enter)</label>
          <div className="mt-2 w-full border border-[#C7DECF] rounded-md px-4 py-3 flex items-center justify-between">
            <input type="text" placeholder="Type name and press enter" className="outline-none flex-1 text-[#115D29]" value={distInput} onChange={(e) => setDistInput(e.target.value)} onKeyDown={handleDistKeyDown} />
            <img src={dropdownIcon} className="w-6 h-6" alt="dropdown" />
          </div>

          <div className="flex gap-3 flex-wrap mt-3">
            {selectedDistributors.map((d) => (
              <div key={d.id} className="px-3 py-1 border border-[#C7DECF] rounded-full text-[#115D29] text-sm flex items-center gap-2 bg-[#F0EFEF]">
                <span>{d.name} (ID: {d.id})</span>
                <button onClick={() => removeDistributor(d.name)}><img src={removeIcon} className="w-[15px]" alt="remove" /></button>
              </div>
            ))}
          </div>

          <label className="text-[#115D29] text-sm font-semibold mt-6 block">Add Medicine</label>
          <div className="mt-2 w-full border border-[#C7DECF] rounded-md px-3 py-2 flex items-center gap-3">
            <input type="text" placeholder="Search Medicine" value={tempMedicine} onChange={(e) => setTempMedicine(e.target.value)} className="outline-none flex-1 text-[#115D29]" />
            <img src={searchIcon} className="w-5 h-5 opacity-80" alt="search" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#115D29] text-sm font-semibold block mb-2">Quantity</label>
              <div className="border border-[#C7DECF] rounded-md px-4 py-3">
                <input type="number" placeholder="Qty" className="outline-none w-full" value={tempQty} onChange={(e) => setTempQty(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-[#115D29] text-sm font-semibold block mb-2">Rate (Per Unit)</label>
              <div className="border border-[#C7DECF] rounded-md px-4 py-3">
                <input type="number" placeholder="Rate" className="outline-none w-full" value={tempRate} onChange={(e) => setTempRate(e.target.value)} />
              </div>
            </div>
          </div>

          <button onClick={handleAddMedicine} className="mt-4 text-[#115D29] text-sm flex items-center gap-2">
            <span className="w-6 h-6 rounded-full border border-[#115D29] flex items-center justify-center">+</span> Add Another Medicine
          </button>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[#115D29] text-sm font-semibold mb-2 block">Order Date</label>
              <div className="relative border border-[#C7DECF] rounded-md px-3 py-3 flex justify-between">
                <input type="text" value={orderDisplay} readOnly className="outline-none text-[#115D29] w-full" />
                <img src={calendarIcon} className="w-5 h-5 cursor-pointer" onClick={() => orderDateNativeRef.current.showPicker()} />
                <input ref={orderDateNativeRef} type="date" className="absolute opacity-0 w-0 h-0" onChange={(e) => { setOrderDateISO(e.target.value); setOrderDisplay(formatISOtoDMY(e.target.value)); }} />
              </div>
            </div>
            <div>
              <label className="text-[#115D29] text-sm font-semibold mb-2 block">Expected Delivery</label>
              <div className="relative border border-[#C7DECF] rounded-md px-3 py-3 flex justify-between">
                <input type="text" value={expectedDisplay} readOnly className="outline-none text-[#115D29] w-full" />
                <img src={calendarIcon} className="w-5 h-5 cursor-pointer" onClick={() => expectedDateNativeRef.current.showPicker()} />
                <input ref={expectedDateNativeRef} type="date" className="absolute opacity-0 w-0 h-0" onChange={(e) => { setExpectedDateISO(e.target.value); setExpectedDisplay(formatISOtoDMY(e.target.value)); }} />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-[#115D29] text-sm font-semibold block mb-3">Delivery Mode</label>
            <div className="flex gap-6"><Radio id="door" checked={deliveryMode === "door"} onChange={() => setDeliveryMode("door")} label="Door Delivery" /><Radio id="pickup" checked={deliveryMode === "pickup"} onChange={() => setDeliveryMode("pickup")} label="Pickup" /></div>
          </div>

          <div className="mt-6">
            <label className="text-[#115D29] text-sm font-semibold block mb-3">Payment Mode</label>
            <div className="flex gap-6 flex-wrap"><Radio id="online" checked={paymentMode === "online"} onChange={() => setPaymentMode("online")} label="Online" /><Radio id="card" checked={paymentMode === "card"} onChange={() => setPaymentMode("card")} label="Card" /><Radio id="cod" checked={paymentMode === "cod"} onChange={() => setPaymentMode("cod")} label="COD" /></div>
          </div>
        </div>

        {/* RIGHT SIDE PREVIEW */}
        <div className="border border-[#B5CDBD] rounded-lg p-6 bg-white">
          <h2 className="text-[#115D29] text-lg font-semibold mb-4">Preview Order</h2>
          <div className="border border-gray-200 p-4 rounded-lg shadow-md">
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#F0EFEF] text-[#115D29]">
                  <tr><th className="text-left px-6 py-4">Medicine</th><th className="text-center px-6 py-4">Qty</th><th className="text-center px-6 py-4">Price</th></tr>
                </thead>
                <tbody>
                  {selectedDistributors.map(dist => (
                    <React.Fragment key={dist.id}>
                      <tr className="font-bold text-[#115D29]"><td colSpan={3} className="px-6 py-2">{dist.name}</td></tr>
                      {medicines.filter(m => m.DistributorName === dist.name).map((m, i) => (
                        <tr key={i} className="text-[#115D29]"><td className="px-6 py-2">{m.MedicineName}</td><td className="text-center">{m.Quantity}</td><td className="text-center">₹{m.TotalAmount}</td></tr>
                      ))}
                    </React.Fragment>
                  ))}
                  <tr className="bg-[#F0EFEF] font-bold text-[#115D29]">
                    <td className="px-6 py-4">Total</td>
                    <td className="text-center">{medicines.reduce((s, m) => s + m.Quantity, 0)}</td>
                    <td className="text-center">₹{medicines.reduce((s, m) => s + m.TotalAmount, 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-[#115D29]">
              <p>Order Date: <b>{orderDisplay}</b></p>
              <p>Expected: <b>{expectedDisplay}</b></p>
              <p>Delivery: <b>{deliveryMode}</b></p>
              <p>Payment: <b>{paymentMode}</b></p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <button 
          disabled={medicines.length === 0 || isSubmitting}
          onClick={handlePlaceOrder} 
          className="w-full bg-[#115D29] text-white py-4 rounded-lg font-medium disabled:bg-gray-400"
        >
          {isSubmitting ? "Processing..." : "Place an order Now"}
        </button>
        <button className="w-full border border-[#115D29] text-[#115D29] py-4 rounded-lg font-medium">Track the Order</button>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-8 text-center max-w-sm relative shadow-lg">
            <button onClick={() => setShowSuccess(false)} className="absolute top-2 right-4"><img src={closeIcon} className="w-5" alt="close" /></button>
            <img src={successIcon} className="mx-auto w-16 mb-4" alt="success" />
            <h3 className="text-lg font-bold text-[#115D29]">Order Placed Successfully!</h3>
            <p className="text-sm text-[#115D29] mt-2">Distributors have been notified.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrderScreen;