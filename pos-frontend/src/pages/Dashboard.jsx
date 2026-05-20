import React, { useState, useEffect } from "react";
import { MdTableBar, MdCategory } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";

import Metrics from "../components/dashboard/Metrics";
import RecentOrders from "../components/dashboard/RecentOrders";

// ✅ MODALS
import TableModal from "../components/dashboard/Modal";
import CategoryModal from "../components/dashboard/CategoryModal";
import DishModal from "../components/dashboard/DishModal";

const buttons = [
  { label: "Add Table", icon: <MdTableBar />, action: "table" },
  { label: "Add Category", icon: <MdCategory />, action: "category" },
  // ❌ REMOVE DIRECT DISH BUTTON (as per your requirement)
  // { label: "Add Dishes", icon: <BiSolidDish />, action: "dish" },
];

const tabs = ["Metrics", "Orders", "Payments"];

const Dashboard = () => {
  useEffect(() => {
    document.title = "POS | Admin Dashboard";
  }, []);

  // ✅ SINGLE STATE (VERY IMPORTANT)
  const [modalType, setModalType] = useState(null);

  const [activeTab, setActiveTab] = useState("Metrics");

  // ✅ HANDLE BUTTON CLICK
  const handleOpenModal = (action) => {
    if (action === "table") setModalType("table");
    if (action === "category") setModalType("category");
  };

  return (
    <div className="bg-[#1f1f1f] min-h-[calc(100vh-5rem)] pb-10">
      
      <div className="container mx-auto flex items-center justify-between py-14 px-6 md:px-4">
        
        {/* BUTTONS */}
        <div className="flex items-center gap-3">
          {buttons.map(({ label, icon, action }, index) => (
            <button
              key={index}
              onClick={() => handleOpenModal(action)}
              className="bg-[#1a1a1a] hover:bg-[#262626] px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2"
            >
              {label} {icon}
            </button>
          ))}
        </div>

        {/* TABS */}
        <div className="flex items-center gap-3">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold ${
                activeTab === tab
                  ? "bg-[#262626]"
                  : "bg-[#1a1a1a] hover:bg-[#262626]"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      {activeTab === "Metrics" && <Metrics />}
      {activeTab === "Orders" && <RecentOrders />}
      {activeTab === "Payments" && (
        <div className="text-white p-6 container mx-auto">
          Payment Component Coming Soon
        </div>
      )}

      {/* ================= MODALS ================= */}

      {/* TABLE MODAL */}
      {modalType === "table" && (
        <TableModal setModalType={setModalType} />
      )}

      {/* CATEGORY MODAL */}
      {modalType === "category" && (
        <CategoryModal setModalType={setModalType} />
      )}

      {/* DISH MODAL (WITH CATEGORY) */}
      {modalType?.type === "dish" && (
        <DishModal
          category={modalType.category}
          setModalType={setModalType}
        />
      )}
    </div>
  );
};

export default Dashboard;