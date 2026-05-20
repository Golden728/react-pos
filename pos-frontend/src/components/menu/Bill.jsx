import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTotalPrice,
  removeAllItems,
} from "../../redux/slices/cartSlice";

import {
  addOrder,
  updateTable,
} from "../../https/index";

import { enqueueSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import { removeCustomer } from "../../redux/slices/customerSlice";

const Bill = () => {

  const dispatch = useDispatch();

  // ================= REDUX =================

  const customerData = useSelector((state) => state.customer);

  const cartData = useSelector((state) => state.cart);

  const total = useSelector(getTotalPrice);

  // ================= TAX =================

  const taxRate = 5.25;

  const tax = (total * taxRate) / 100;

  const totalPriceWithTax = total + tax;

  // ================= PRINT KOT =================

  const printKOT = async (orderData) => {

    try {

      await fetch("http://localhost:8000/api/print", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          type: "kot",
          order: {
            customerDetails: {
              name: customerData.customerName,
            },

            tableNo: customerData?.table?.tableNo,

            items: cartData,

            bills: {
              total,
              tax,
              totalWithTax: totalPriceWithTax,
            },
          },
        }),
      });

      console.log("✅ KOT Printed");

    } catch (err) {

      console.log("❌ Print Error:", err);

    }
  };

  // ================= PLACE ORDER =================

  const handleProceedOrder = () => {

    // ✅ EMPTY CART CHECK
    if (cartData.length === 0) {

      enqueueSnackbar("Cart is empty!", {
        variant: "warning",
      });

      return;
    }

    // ✅ CUSTOMER NAME CHECK
    if (!customerData.customerName) {

      enqueueSnackbar("Enter customer name!", {
        variant: "warning",
      });

      return;
    }

    // ✅ TABLE CHECK
    if (!customerData?.table?.tableId) {

      enqueueSnackbar("Please select table!", {
        variant: "warning",
      });

      return;
    }

    // ================= ORDER DATA =================

    const orderData = {

      customerDetails: {
        name: customerData.customerName,
        phone: customerData.customerPhone,
        guests: customerData.guests,
      },

      orderStatus: "In Progress",

      paymentStatus: "Pending",

      paymentMethod: "Pending",

      bills: {
        total,
        tax,
        totalWithTax: totalPriceWithTax,
      },

      items: cartData,

      table: customerData.table.tableId,
    };

    console.log("✅ ORDER DATA:", orderData);

    orderMutation.mutate(orderData);
  };

  // ================= ORDER MUTATION =================

  const orderMutation = useMutation({

    mutationFn: addOrder,

    onSuccess: async (response) => {

      console.log("✅ ORDER RESPONSE:", response);

      // ✅ SUPPORT BOTH API RESPONSE STRUCTURES
      const order =
        response?.data ||
        response?.data?.data ||
        response;

      // ================= PRINT KOT =================

      await printKOT(order);

      // ================= UPDATE TABLE =================

      const tablePayload = {

        tableId: customerData.table.tableId,

        status: "Booked",

        orderId: order._id,
      };

      console.log("✅ TABLE UPDATE:", tablePayload);

      tableUpdateMutation.mutate(tablePayload);

      enqueueSnackbar(
        "Order placed & table booked!",
        {
          variant: "success",
        }
      );
    },

    onError: (error) => {

      console.log(error);

      enqueueSnackbar(
        error?.response?.data?.message ||
          "Order failed!",
        {
          variant: "error",
        }
      );
    },
  });

  // ================= TABLE UPDATE =================

  const tableUpdateMutation = useMutation({

    mutationFn: updateTable,

    onSuccess: () => {

      console.log("✅ TABLE BOOKED");

      // ✅ CLEAR REDUX
      dispatch(removeCustomer());

      dispatch(removeAllItems());
    },

    onError: (error) => {

      console.log(error);

      enqueueSnackbar(
        error?.response?.data?.message ||
          "Table update failed!",
        {
          variant: "error",
        }
      );
    },
  });

  return (
    <>

      {/* ================= BILL SUMMARY ================= */}

      <div className="flex justify-between px-5 mt-2">

        <p className="text-xs text-[#ababab]">
          Items ({cartData.length})
        </p>

        <h1 className="text-white font-bold">
          ₹{total.toFixed(2)}
        </h1>
      </div>

      <div className="flex justify-between px-5 mt-2">

        <p className="text-xs text-[#ababab]">
          Tax ({taxRate}%)
        </p>

        <h1 className="text-white font-bold">
          ₹{tax.toFixed(2)}
        </h1>
      </div>

      <div className="flex justify-between px-5 mt-2">

        <p className="text-xs text-[#ababab]">
          Total
        </p>

        <h1 className="text-green-400 font-bold text-lg">
          ₹{totalPriceWithTax.toFixed(2)}
        </h1>
      </div>

      {/* ================= BUTTON ================= */}

      <div className="px-5 mt-5 flex flex-col gap-2">

        <button
          onClick={handleProceedOrder}
          disabled={
            orderMutation.isPending ||
            tableUpdateMutation.isPending
          }
          className="bg-yellow-500 hover:bg-yellow-400 transition py-3 rounded font-bold text-black disabled:opacity-50"
        >
          {orderMutation.isPending
            ? "Placing Order..."
            : "Place Order & Print KOT 🧾"}
        </button>

      </div>
    </>
  );
};

export default Bill;