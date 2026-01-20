import React, { useState } from "react";
import backIcon from "../../../../assets/CustomerOrder/back.png";
import CreateManualOrderPageLeft from "./CreateManualOrderPageLeft";
import CreateManualOrderPageRight from "./CreateManualOrderPageRight";

export default function CreateManualOrderLayout({ onClose }) {
  const goBack = () => {
    if (onClose) onClose();
  };

  // Parent state (shared between left and right)
  const [customer, setCustomer] = useState({
    fullName: "",
    contact: "",
    email: "",
    address: "",
    deliveryAddress: "",
  });

  const [medicines, setMedicines] = useState([
    { id: 1, name: "", brand: "", qtyMin: "", qtyMax: "", price: "", expiry: "" },
  ]);

  const [orderMeta, setOrderMeta] = useState({
    orderDate: "",
    expectedDate: "",
    deliveryMode: "pickup",
    paymentMode: "online",
  });

  const [quickChecklist, setQuickChecklist] = useState({
    notifyCustomer: false,
    validLicense: false,
    gstIncluded: false,
    replacementPolicy: false,
  });

  // handlers forwarded to left
  const updateCustomer = (field, value) => {
    setCustomer((c) => ({ ...c, [field]: value }));
  };

  const addMedicine = () => {
    setMedicines((m) => [
      ...m,
      { id: Date.now(), name: "", brand: "", qtyMin: "", qtyMax: "", price: "", expiry: "" },
    ]);
  };

  const deleteMedicine = (id) => {
    setMedicines((m) => m.filter((item) => item.id !== id));
  };

  const updateMedicine = (id, field, value) => {
    setMedicines((m) => m.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const updateOrderMeta = (field, value) => {
    setOrderMeta((o) => ({ ...o, [field]: value }));
  };

  const updateQuickChecklist = (field, value) => {
    setQuickChecklist((q) => ({ ...q, [field]: value }));
  };

  // Generate a simple Order ID (keeps UI dynamic)
  const orderId = React.useMemo(() => {
    const ts = Date.now().toString();
    return `ORD-${ts.slice(-6)}`;
  }, [medicines, customer, orderMeta]);

  return (
    <div
      className="w-full min-h-screen bg-white px-6 py-4"
      style={{
        overflowY: "scroll",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <style>{`
        div::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>

      {/* Top Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4 mt-2 cursor-pointer" onClick={goBack}>
          <img
            src={backIcon}
            alt="Back"
            className="w-4 h-4"
            style={{ objectFit: "contain", marginTop: "1px" }}
          />
          <span className="text-green-700 text-[14px]  font-medium leading-none">Back</span>
        </div>

        <div className="mt-1">
          <span className="text-green-700 text-[22px] font-semibold">Create Manual Purchase Order</span>
        </div>
      </div>

      {/* Page Container */}
      <div
        className="
          w-full 
          flex 
          flex-col
          lg:flex-row
          gap-4
          justify-between
        "
      >
        {/* LEFT BOX */}
        <div
          className="bg-white w-full h-auto"
          style={{
            borderRadius: "8px",
            border: "1px solid #B5CDBD",
            padding: "16px",
          }}
        >
          <CreateManualOrderPageLeft
            // customer
            customer={customer}
            updateCustomer={updateCustomer}
            // medicines
            medicines={medicines}
            addMedicine={addMedicine}
            deleteMedicine={deleteMedicine}
            updateMedicine={updateMedicine}
            // order meta
            orderMeta={orderMeta}
            updateOrderMeta={updateOrderMeta}
            // quick checklist
            quickChecklist={quickChecklist}
            updateQuickChecklist={updateQuickChecklist}
          />
        </div>

        {/* RIGHT BOX */}
        <div
          className="bg-white w-full h-auto"
          style={{
            borderRadius: "8px",
            border: "1px solid #B5CDBD",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <CreateManualOrderPageRight
            customer={customer}
            medicines={medicines}
            orderMeta={orderMeta}
            quickChecklist={quickChecklist}
            orderId={orderId}
            // static retailer info will be used inside right component
          />
        </div>
      </div>
    </div>
  );
}
