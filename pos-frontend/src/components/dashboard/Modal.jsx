import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { addTable } from "../../https";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

const Modal = ({ setModalType }) => {
  const queryClient = useQueryClient();

  const [tableData, setTableData] = useState({
    tableNo: "",
    seats: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTableData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ FIX CLOSE
  const handleCloseModal = () => {
    setModalType(null);
  };

  const tableMutation = useMutation({
    mutationFn: addTable,

    onSuccess: (res) => {
      console.log("SUCCESS:", res);

      enqueueSnackbar(res?.message || "Table added successfully", {
        variant: "success",
      });

      queryClient.invalidateQueries(["tables"]);

      // ✅ CLOSE MODAL
      setModalType(null);
    },

    onError: (error) => {
      console.log("ERROR:", error);

      const message =
        error?.response?.data?.message || "Something went wrong";

      enqueueSnackbar(message, { variant: "error" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    tableMutation.mutate({
      tableNo: Number(tableData.tableNo),
      seats: Number(tableData.seats),
    });
  };

  return (
    <div
      onClick={handleCloseModal}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#262626] p-6 rounded-lg shadow-lg w-96"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-semibold">Add Table</h2>

          <button
            onClick={handleCloseModal}
            className="text-white hover:text-red-500"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            name="tableNo"
            placeholder="Table Number"
            value={tableData.tableNo}
            onChange={handleInputChange}
            className="w-full p-3 bg-[#1f1f1f] text-white rounded"
            required
          />

          <input
            type="number"
            name="seats"
            placeholder="Seats"
            value={tableData.seats}
            onChange={handleInputChange}
            className="w-full p-3 bg-[#1f1f1f] text-white rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-yellow-400 py-3 rounded font-bold"
          >
            {tableMutation.isPending ? "Adding..." : "Add Table"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Modal;