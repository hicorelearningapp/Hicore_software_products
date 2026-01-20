import React from "react";
import AddItem from "./AddItem"; // Import your page

export default function AddItemModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div
        className="bg-white rounded-xl shadow-lg"
        style={{
          width: "700px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "16px",
        }}
      >
        <AddItem onClose={onClose} />
      </div>
    </div>
  );
}
