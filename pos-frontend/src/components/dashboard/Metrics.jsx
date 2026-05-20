import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics } from "../../https";

const Metrics = () => {

  const [filter, setFilter] = useState("1month");

  // ✅ FORMAT FUNCTION
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboardMetrics", filter],
    queryFn: () => getDashboardMetrics(filter),
  });

  if (isLoading) {
    return <p className="text-white">Loading...</p>;
  }

  if (isError) {
    return <p className="text-red-500">Error loading metrics</p>;
  }

  // ✅ SAFE DATA EXTRACTION
  const metrics = data || {};

  const revenue = metrics.monthlyEarnings || 0;
  const inProgressOrders = metrics.inProgressOrders || 0;
  const yesterday = metrics.yesterdayEarnings || 0;
  const totalEarnings = metrics.totalEarnings || 0;

  return (
    <div>

      {/* 🔽 FILTER */}
      <div className="flex justify-end mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          <option value="7days">Last 7 Days</option>
          <option value="1month">Last 1 Month</option>
          <option value="1year">Last 1 Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* 📊 METRICS */}
      <div className="grid grid-cols-4 gap-4">

        {/* REVENUE */}
        <div className="bg-blue-600 p-4 rounded">
          <p className="text-white text-sm">Revenue (This Month)</p>
          <p className="text-white text-2xl font-bold">
            {formatCurrency(revenue)}
          </p>
        </div>

        {/* IN PROGRESS */}
        <div className="bg-green-600 p-4 rounded">
          <p className="text-white text-sm">In Progress Orders</p>
          <p className="text-white text-2xl font-bold">
            {inProgressOrders}
          </p>
        </div>

        {/* YESTERDAY */}
        <div className="bg-yellow-500 p-4 rounded">
          <p className="text-white text-sm">Yesterday Earnings</p>
          <p className="text-white text-2xl font-bold">
            {formatCurrency(yesterday)}
          </p>
        </div>

        {/* TOTAL */}
        <div className="bg-purple-600 p-4 rounded">
          <p className="text-white text-sm">Total Earnings</p>
          <p className="text-white text-2xl font-bold">
            {formatCurrency(totalEarnings)}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Metrics;