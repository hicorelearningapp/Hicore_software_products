// src/.../MedicinesList.jsx
import React, { useMemo, useState } from "react";
import MedicineInfo from "./MedicineInfo"; // <-- same folder, adjust path if needed

// Icons / images from assets (you already have these paths)
import iconAZ from "../../../../assets/Customers/Medicines/icon-az.png";
import iconZA from "../../../../assets/Customers/Medicines/icon-za.png";
import searchIcon from "../../../../assets/Customers/Medicines/scan.png";
import heartIcon from "../../../../assets/Customers/Medicines/Save.png";
import tabletImg from "../../../../assets/Customers/Medicines/dolo.jpg";
import cartIcon from "../../../../assets/Customers/Medicines/Cart.png";
import locationIcon from "../../../../assets/Customers/Medicines/Location.png";
import starIcon from "../../../../assets/Customers/Medicines/Star.png";
import storeIcon from "../../../../assets/Customers/Medicines/Retailer.png";
import mailIcon from "../../../../assets/Customers/Medicines/mail.png";
import phoneIcon from "../../../../assets/Customers/Medicines/phone.png";
import closeIcon from "../../../../assets/Customers/Medicines/cancel.png";
import successIcon from "../../../../assets/Customers/Medicines/success.png";

import { useCart } from "../../CustomersDashboard/Cart/CartContext";

const MedicinesList = ({ sub, onBackToCategories, onBackToSubCategories }) => {
  // UI state
  const [searchText, setSearchText] = useState("");
  const [sortToggle, setSortToggle] = useState(false); // false = A->Z/title asc, true = Z->A/title desc
  const [filters, setFilters] = useState({
    inStock: false,
    generic: false,
    prescriptionRequired: false,
  });

  // Modal state (stores modal)
  const [showStoresModal, setShowStoresModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // Added-to-cart modal state
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [addedItem, setAddedItem] = useState(null);

  // Info page modal state (full-screen popup)
  const [showInfoPage, setShowInfoPage] = useState(false);

  const openStoresModal = (med) => {
    setSelectedMedicine(med);
    setShowStoresModal(true);
  };

  const closeStoresModal = () => {
    setShowStoresModal(false);
    setSelectedMedicine(null);
  };
const { addToCart } = useCart();
  // Add to cart handler (opens success popup)
 const handleAddToCart = (med) => {
  addToCart({
    id: med.id,
    name: med.title,
    price: med.price,
    gst: 5,        // you can replace with actual GST from API
    image: tabletImg,
  });
  setAddedItem(med);
  setShowAddedModal(true);
};

  const closeAddedModal = () => {
    setShowAddedModal(false);
    setAddedItem(null);
  };

  // Open full-page medicine info as modal
  const openMedicineInfoPage = (med) => {
    setSelectedMedicine(med);
    setShowInfoPage(true);
    // ensure the modal starts near top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeMedicineInfoPage = () => {
    setShowInfoPage(false);
    setSelectedMedicine(null);
  };

  // Temporary dummy list until API connected (same item repeated to show grid)
  const medicines = [
    {
      id: 1,
      title: "Paracetamol 650mg",
      count: "10 tablets",
      brand: "Crocin Advance",
      expiry: "11/12/2027",
      suggestion: "Dolo 650 – better rated",
      price: 50,
      rating: 4.5,
      reviews: 234,
      nearby: 3,
    },
    {
      id: 2,
      title: "Dolo 650mg",
      count: "10 tablets",
      brand: "Micro Labs",
      expiry: "02/08/2028",
      suggestion: "Good pain relief, low GI upset",
      price: 48,
      rating: 4.6,
      reviews: 412,
      nearby: 5,
    },
    {
      id: 3,
      title: "Combiflam 325+500mg",
      count: "10 tablets",
      brand: "GSK",
      expiry: "15/03/2026",
      suggestion: "Stronger analgesic for fever",
      price: 65,
      rating: 4.3,
      reviews: 189,
      nearby: 2,
    },
    {
      id: 4,
      title: "Ibuprofen 400mg",
      count: "10 tablets",
      brand: "Brufen",
      expiry: "20/11/2027",
      suggestion: "Use for inflammation",
      price: 72,
      rating: 4.2,
      reviews: 98,
      nearby: 4,
    },
    {
      id: 5,
      title: "Paracetamol 500mg",
      count: "20 tablets",
      brand: "Calpol",
      expiry: "01/06/2029",
      suggestion: "Lower dose for kids",
      price: 40,
      rating: 4.7,
      reviews: 521,
      nearby: 6,
    },
    {
      id: 6,
      title: "Aceclofenac 100mg",
      count: "10 tablets",
      brand: "Zerodol",
      expiry: "09/09/2026",
      suggestion: "For joint pain — prescription advised",
      price: 85,
      rating: 4.1,
      reviews: 77,
      nearby: 1,
    },
  ];

  // Dummy store list for modal (in real app you will fetch / receive from API)
  const dummyStores = [
    {
      id: 1,
      name: "MedPlus",
      distance: "0.8km",
      rating: "4.7",
      reviews: 234,
      price: 25,
    },
    {
      id: 2,
      name: "Apollo Pharmacy",
      distance: "1.5km",
      rating: "4.5",
      reviews: 234,
      price: 26,
    },
    {
      id: 3,
      name: "HealthKart Store",
      distance: "1.5km",
      rating: "4.3",
      reviews: 234,
      price: 24,
    },
  ];

  // Filter + search + sort logic
  const filtered = useMemo(() => {
    const q = (searchText || "").trim().toLowerCase();

    let list = medicines.slice(); // shallow copy

    // Search: filter by title, brand, suggestion
    if (q.length > 0) {
      list = list.filter((m) => {
        const inTitle = (m.title || "").toLowerCase().includes(q);
        const inBrand = (m.brand || "").toLowerCase().includes(q);
        const inSuggestion = (m.suggestion || "").toLowerCase().includes(q);
        return inTitle || inBrand || inSuggestion;
      });
    }

    if (filters.inStock) {
      list = list.filter((m) => m.inStock !== false);
    }
    if (filters.generic) {
      list = list.filter((m) => m.generic !== false);
    }
    if (filters.prescriptionRequired) {
      list = list.filter((m) => m.prescriptionRequired !== false);
    }

    list.sort((a, b) => {
      const ta = (a.title || "").toLowerCase();
      const tb = (b.title || "").toLowerCase();
      if (ta < tb) return sortToggle ? 1 : -1;
      if (ta > tb) return sortToggle ? -1 : 1;
      return 0;
    });

    return list;
  }, [searchText, sortToggle, filters, medicines]);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-6 items-center text-sm">
        <button
          onClick={onBackToCategories}
          className="text-[#2874BA] hover:underline"
        >
          Medicines
        </button>

        <span className="text-[#2874BA]">{">"}</span>

        <button
          onClick={onBackToSubCategories}
          className="text-[#2874BA] hover:underline"
        >
          Medicines Category
        </button>

        <span className="text-[#2874BA]">{">"}</span>

        <span className="text-[#2874BA]">Medicines List</span>
      </div>

      {/* Top control container (unchanged structure) */}
      <div className="w-full flex flex-col xl:flex-row items-center gap-4 bg-[#F7F9F7] p-4 rounded-xl border border-[#D4E5D9] mb-10 mt-4">
        {/* Sort */}
        <div className="flex items-center gap-3 border border-[#B5CDBD] rounded-xl px-4 py-2">
          <img src={iconAZ} alt="A-Z" className="w-5 h-5" />

          <div
            onClick={() => setSortToggle((s) => !s)}
            className="w-12 h-6 bg-gray-200 rounded-full flex items-center px-1 cursor-pointer relative"
            role="button"
            aria-pressed={sortToggle}
          >
            <div
              className={`w-5 h-5 rounded-full transform transition-all ${
                sortToggle
                  ? "translate-x-6 bg-green-600"
                  : "translate-x-0 bg-green-600"
              }`}
            />
          </div>

          <img src={iconZA} alt="Z-A" className="w-5 h-5" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 border border-[#B5CDBD] rounded-xl px-6 py-2 text-[#115D29]">
          <span className="text-sm font-medium">Filter by :</span>

          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={() =>
                setFilters((p) => ({ ...p, inStock: !p.inStock }))
              }
              className="w-4 h-4 border border-[#115D29] rounded accent-green-600"
            />
            In Stock
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.generic}
              onChange={() =>
                setFilters((p) => ({ ...p, generic: !p.generic }))
              }
              className="w-4 h-4 border border-[#115D29] rounded accent-green-600"
            />
            Generic
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.prescriptionRequired}
              onChange={() =>
                setFilters((p) => ({
                  ...p,
                  prescriptionRequired: !p.prescriptionRequired,
                }))
              }
              className="w-4 h-4 border border-[#115D29] rounded accent-green-600"
            />
            Prescription Required
          </label>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between flex-1 border border-[#B5CDBD] rounded-xl px-4 py-2 w-full xl:w-auto">
          <input
            type="text"
            placeholder="Search your medicines..."
            className="w-full outline-none text-sm text-[#115D29] placeholder-[#9FB8A7]"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            aria-label="Search medicines"
          />
          <img
            src={searchIcon}
            alt="search"
            className="w-6 h-6 opacity-80 cursor-pointer"
            onClick={() => {}}
          />
        </div>
      </div>

      {/* Medicine Cards Grid (responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="rounded-xl border border-[#E6F0EA] bg-white overflow-hidden shadow-sm"
          >
            {/* Top image only (same image for all as requested) */}
            <div className="bg-[#FAFBFA] p-4 flex justify-center items-center relative">
              <img
                src={tabletImg}
                alt={m.title}
                className="w-full h-44 object-cover rounded-md"
              />
            </div>

            {/* Details area */}
            <div className="p-4">
              {/* wishlist icon at top right of details block (floating) */}
              <div className="relative">
                <img
                  src={heartIcon}
                  alt="save"
                  className="w-6 h-6 absolute top-0 right-0 opacity-80"
                />
              </div>

              {/* Title */}
              <h3 className="text-[#115D29] text-xl font-semibold mt-3">
                {m.title}
              </h3>

              {/* count */}
              <p className="text-[#2F6F3B] text-md mt-3">{m.count}</p>

              {/* Brand + Expiry (aligned left/right) */}
              <div className="flex justify-between items-center mt-4 text-md">
                <span className="text-[#115D29] font-medium">{m.brand}</span>
                <span className="text-[#0E9243]">Expiry Date : {m.expiry}</span>
              </div>

              {/* AI Suggestion pill */}
              <div className="mt-4">
                <span className="inline-block border border-[#AF840D] bg-[#AF840D]/5 text-[#AF840D] text-sm px-4 py-3 rounded-full">
                  AI Suggests: {m.suggestion}
                </span>
              </div>

              {/* Price + Rating row */}
              <div className="flex justify-between items-center mt-4">
                <div className="text-[#115D29] text-2xl font-bold">
                  ₹{m.price}
                </div>
                <div className="text-gray-600 text-sm">
                  {m.rating} ({m.reviews} reviews)
                </div>
              </div>

              {/* Links row - one opens modal */}
              <div className="flex justify-between items-center mt-3 text-sm">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => openStoresModal(m)}
                  aria-haspopup="dialog"
                >
                  Available in {m.nearby} nearby stores
                </button>
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => openMedicineInfoPage(m)}
                >
                  Medicine Info
                </button>
              </div>

              {/* Add to cart button */}
              <button
                className="mt-4 w-full bg-[#115D29] text-white px-4 py-3 rounded-xl flex items-center justify-center gap-3"
                onClick={() => handleAddToCart(m)}
              >
                <img src={cartIcon} alt="cart" className="w-5 h-5" />
                <span className="font-medium">Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Nearby Stores Modal (centered popup) */}
      {showStoresModal && selectedMedicine && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Nearby Store Availability"
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={closeStoresModal}
          />

          {/* modal panel */}
          <div
            className="relative bg-white w-[92%] max-w-xl rounded-2xl border border-[#E6F0EA] p-10 shadow-lg z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* close button (right) using asset */}
            <button
              onClick={closeStoresModal}
              className="absolute top-5 right-10 rounded-full flex items-center justify-center hover:bg-[#F0FBF4] p-1"
              aria-label="Close"
            >
              <img src={closeIcon} alt="close" className="w-6 h-6" />
            </button>

            <h2 className="text-lg font-semibold text-[#115D29]">
              Nearby Store Availability
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {selectedMedicine.title} - {selectedMedicine.brand}
            </p>

            {/* store cards */}
            <div className="mt-6 flex flex-col gap-4">
              {dummyStores.map((store) => (
                <div
                  key={store.id}
                  className="border border-[#EAF2EE] rounded-xl p-4 bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-[#115D29] font-medium">
                        {store.name}
                      </h3>

                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <img
                            src={locationIcon}
                            alt="loc"
                            className="w-4 h-4"
                          />
                          <span>{store.distance}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <img src={starIcon} alt="star" className="w-4 h-4" />
                          <span>
                            {store.rating} ({store.reviews})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end ml-4">
                      <div className="flex items-center gap-2 mb-2">
                        <img src={mailIcon} alt="mail" className="w-5 h-5" />
                        <img src={phoneIcon} alt="phone" className="w-5 h-5" />
                      </div>
                      <div className="text-[#115D29] font-semibold text-lg">
                        ₹{store.price}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    {/* UPDATED BUTTON: white border on hover + subtle gray shadow */}
                    <button
                      className="w-full bg-[#10522C] text-white py-3 rounded-lg flex items-center justify-center gap-3 border-2 border-transparent transition-all duration-150 hover:border-white hover:shadow-lg hover:shadow-gray-500"
                      aria-label={`Select ${store.name}`}
                    >
                      <img src={storeIcon} alt="store" className="w-5 h-5" />
                      <span className="font-medium">Select Store & Add</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Added to Cart Modal */}
      {showAddedModal && addedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Added to Cart"
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/20"
            onClick={closeAddedModal}
          />

          {/* popup */}
          <div
            className="relative bg-white w-[56%] max-w-xs rounded-xl border-2 border-[#E6F0EA] p-8 text-center shadow-md z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* close top-right */}
            <button
              onClick={closeAddedModal}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F0FBF4]"
              aria-label="Close"
            >
              <img src={closeIcon} alt="close" className="w-7 h-7" />
            </button>

            {/* success icon */}
            <div className="flex mt-4 justify-center">
              <img src={successIcon} alt="success" className="w-12 h-12" />
            </div>

            <h3 className="mt-4 text-[#115D29] font-semibold text-lg">
              Added to Cart
            </h3>

            <p className="mt-3 text-[#2F6F3B] leading-[32px] text-sm">
              {addedItem.title} added
            </p>
            <p className="text-[#2F6F3B] text-sm">successfully</p>
          </div>
        </div>
      )}

      {/* Medicine Info Full-screen Modal */}
      {showInfoPage && selectedMedicine && (
        <MedicineInfo
          medicine={selectedMedicine}
          onClose={closeMedicineInfoPage}
        />
      )}
    </div>
  );
};

export default MedicinesList;
