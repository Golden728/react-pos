import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTables } from "../https";
import { enqueueSnackbar } from "notistack";

const Tables = () => {
  const [status, setStatus] = useState("all");

  useEffect(() => {
    document.title = "POS | Tables";
  }, []);

  const {
    data: tables = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
    placeholderData: keepPreviousData,
    refetchInterval: 2000,
  });

  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Something went wrong!", {
        variant: "error",
      });
    }
  }, [isError]);

  if (isLoading) {
    return (
      <div className="bg-[#1f1f1f] h-screen flex items-center justify-center">
        <h1 className="text-white text-2xl font-bold">
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-10 py-4">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <BackButton />

          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
            Tables
          </h1>
        </div>

        {/* FILTER BUTTONS */}
        <div className="flex items-center gap-4">

          <button
            onClick={() => setStatus("all")}
            className={`px-5 py-2 rounded-lg text-white font-semibold transition ${
              status === "all"
                ? "bg-[#383838]"
                : "bg-[#262626] hover:bg-[#333333]"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setStatus("booked")}
            className={`px-5 py-2 rounded-lg text-white font-semibold transition ${
              status === "booked"
                ? "bg-[#383838]"
                : "bg-[#262626] hover:bg-[#333333]"
            }`}
          >
            Booked
          </button>

          <button
            onClick={() => setStatus("available")}
            className={`px-5 py-2 rounded-lg text-white font-semibold transition ${
              status === "available"
                ? "bg-[#383838]"
                : "bg-[#262626] hover:bg-[#333333]"
            }`}
          >
            Available
          </button>

        </div>
      </div>

      {/* TABLE GRID */}
      <div className="grid grid-cols-5 gap-4 px-10 py-4 h-[650px] overflow-y-auto scrollbar-hide content-start">

        {tables
          .filter((table) => {
            if (status === "all") return true;

            return (
              table?.status?.toLowerCase() ===
              status.toLowerCase()
            );
          })
          .map((table) => (
            <TableCard
              key={table._id}
              id={table._id}
              name={table.tableNo}
              status={table.status}
              initials={
                table?.currentOrder?.customerDetails?.name
              }
              seats={table.seats}
            />
          ))}

      </div>

      <BottomNav />
    </section>
  );
};

export default Tables;