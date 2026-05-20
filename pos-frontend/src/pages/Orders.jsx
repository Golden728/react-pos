import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/orders/OrderCard";
import BackButton from "../components/shared/BackButton";

import axios from "axios";

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getOrders,
  updateOrder,
  updateTable,
} from "../https/index";

import { enqueueSnackbar } from "notistack";

const Orders = () => {
  const queryClient = useQueryClient();

  const [status, setStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showPrintPopup, setShowPrintPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "POS | Orders";
  }, []);

  // ================= FETCH =================
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    placeholderData: keepPreviousData,
  });

  // ✅ FIX: Proper error handling
  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  }, [isError]);

  if (isLoading) {
    return <div className="text-white text-center p-10">Loading...</div>;
  }

  // ✅ FIX: orders already array
  const filteredOrders = orders.filter((order) => {
    if (status === "all") return true;
    if (status === "progress") return order.orderStatus === "In Progress";
    if (status === "ready") return order.orderStatus === "Ready";
    if (status === "completed") return order.orderStatus === "Completed";
    return true;
  });

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowPopup(true);
  };

  // ================= CASH =================
  const handleCash = async () => {
    try {
      setLoading(true);

      await updateOrder({
        orderId: selectedOrder?._id,
        orderStatus: "Completed",
        paymentStatus: "Paid",
      });

      await updateTable({
        tableId: selectedOrder?.table?._id,
        status: "Available",
        orderId: null,
      });

      enqueueSnackbar("Cash Payment Done", { variant: "success" });

      setShowPopup(false);
      setShowPrintPopup(true);

      queryClient.invalidateQueries(["orders"]);

    } catch {
      enqueueSnackbar("Cash Payment Failed", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ================= PRINT =================
  const printA4 = () => {
    const content = document.getElementById("a4-print").innerHTML;
    const win = window.open("", "", "width=900,height=700");

    win.document.write(`
      <html>
        <body onload="window.print();window.close()">
          ${content}
        </body>
      </html>
    `);

    win.document.close();
  };

  const printThermal = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/print`,
        {
          type: "bill",
          order: selectedOrder,
        }
      );

      enqueueSnackbar("Printing to thermal printer...", {
        variant: "success",
      });

      setShowPrintPopup(false);

    } catch (err) {
      console.log(err);
      enqueueSnackbar("Thermal print failed", { variant: "error" });
    }
  };

  return (
    <section className="bg-[#1f1f1f] min-h-screen text-white">

      {/* HEADER */}
      <div className="flex justify-between px-10 py-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-2xl font-bold">Orders</h1>
        </div>

        <div className="flex gap-4">
          {["all", "progress", "ready", "completed"].map((item) => (
            <button
              key={item}
              onClick={() => setStatus(item)}
              className={`px-5 py-2 rounded ${
                status === item ? "bg-[#383838]" : ""
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS GRID */}
      <div className="grid grid-cols-3 gap-3 px-16 py-4">
        {filteredOrders.length === 0 ? (
          <p className="text-gray-400 text-center col-span-3">
            No Orders Found
          </p>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} onClick={() => handleOrderClick(order)}>
              <OrderCard order={order} />
            </div>
          ))
        )}
      </div>

      {/* ================= PAYMENT POPUP ================= */}
      {showPopup && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-[#262626] p-6 rounded w-[400px]">

            <h2 className="text-xl mb-3">
              {selectedOrder.customerDetails?.name}
            </h2>

            <p>Table: {selectedOrder.table?.tableNo}</p>

            <button
              onClick={handleCash}
              disabled={loading}
              className="bg-green-500 w-full py-2 rounded mt-4"
            >
              {loading ? "Processing..." : "Cash Payment"}
            </button>

            <button
              onClick={() => setShowPopup(false)}
              className="bg-red-500 w-full py-2 mt-2 rounded"
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* ================= PRINT POPUP ================= */}
      {showPrintPopup && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-[#262626] p-6 rounded w-[350px] text-center">

            <h2 className="text-xl font-bold mb-4">
              Print Bill 🧾
            </h2>

            <button
              onClick={printA4}
              className="bg-blue-500 w-full py-2 rounded mb-2"
            >
              Print A4 Invoice
            </button>

            <button
              onClick={printThermal}
              className="bg-yellow-500 w-full py-2 rounded mb-2"
            >
              Thermal Print
            </button>

            <button
              onClick={() => setShowPrintPopup(false)}
              className="bg-gray-600 w-full py-2 rounded"
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* ================= A4 TEMPLATE ================= */}
      {selectedOrder && (
        <div id="a4-print" className="hidden">
          <div style={{ padding: "40px", fontFamily: "Arial" }}>
            <h1 style={{ textAlign: "center" }}>RESTRO POS</h1>

            <p>Customer: {selectedOrder.customerDetails?.name}</p>
            <p>Table: {selectedOrder.table?.tableNo}</p>

            <hr />

            {selectedOrder.items.map((item, i) => (
              <div key={i}>
                {item.name} x {item.quantity} = ₹{item.price * item.quantity}
              </div>
            ))}

            <hr />

            <h2>Total ₹{selectedOrder.bills?.totalWithTax}</h2>
          </div>
        </div>
      )}

      <BottomNav />
    </section>
  );
};

export default Orders;