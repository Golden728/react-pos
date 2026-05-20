import React, { useEffect, useState } from "react";
import BottomNav from "../components/shared/BottomNav";
import { getAnalysisData } from "../https";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analysis = () => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("day");

  const [dishStats, setDishStats] = useState([]);
  const [popularTables, setPopularTables] = useState([]);
  const [trafficData, setTrafficData] = useState([]);

  const [showAll, setShowAll] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ================= FETCH QUICK FILTER =================

  useEffect(() => {
    if (!fromDate && !toDate) {
      fetchAnalysis(filter);
    }
  }, [filter]);

  const getDates = (type) => {
    const end = new Date();
    const start = new Date();

    if (type === "day") start.setDate(end.getDate() - 1);
    if (type === "week") start.setDate(end.getDate() - 7);
    if (type === "month") start.setMonth(end.getMonth() - 1);
    if (type === "year") start.setFullYear(end.getFullYear() - 1);

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  };

  const fetchAnalysis = async (type) => {
    try {
      setLoading(true);

      const { startDate, endDate } = getDates(type);

      const data = await getAnalysisData(startDate, endDate);

      console.log("Analysis Data:", data);

      setDishStats(data?.dishStats || []);
      setPopularTables(data?.popularTables || []);
      setTrafficData(data?.customerTraffic || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= DATE RANGE =================

  useEffect(() => {
    if (fromDate && toDate) {
      fetchDateRange();
    }
  }, [fromDate, toDate]);

  const fetchDateRange = async () => {
    try {
      setLoading(true);

      const start = new Date(fromDate);
      const end = new Date(toDate);

      end.setHours(23, 59, 59, 999);

      const data = await getAnalysisData(
        start.toISOString(),
        end.toISOString()
      );

      console.log("Date Range Data:", data);

      setDishStats(data?.dishStats || []);
      setPopularTables(data?.popularTables || []);
      setTrafficData(data?.customerTraffic || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const dishesToShow = showAll ? dishStats : dishStats.slice(0, 5);

  // ================= FORMAT GRAPH DATA =================

  const labels = trafficData.map((t) =>
    new Date(t._id).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    })
  );

  const dataValues = trafficData.map((t) => t.customers);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Customers per Day",
        data: dataValues,
        borderColor: "#facc15",
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) return null;

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );

          gradient.addColorStop(0, "rgba(250,204,21,0.6)");
          gradient.addColorStop(1, "rgba(250,204,21,0)");

          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#facc15",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ccc",
        },
        grid: {
          color: "#333",
        },
      },
      y: {
        ticks: {
          color: "#ccc",
        },
        grid: {
          color: "#333",
        },
      },
    },
  };

  return (
    <section className="bg-[#1f1f1f] min-h-screen p-5 text-white pb-24">
      <h1 className="text-2xl font-bold mb-5">
        Analysis Dashboard
      </h1>

      {/* FILTERS */}

      <div className="flex gap-3 mb-5 flex-wrap">
        <button
          onClick={() => {
            setFromDate("");
            setToDate("");
            setFilter("day");
          }}
          className="bg-yellow-500 px-3 py-1 rounded"
        >
          1 Day
        </button>

        <button
          onClick={() => {
            setFromDate("");
            setToDate("");
            setFilter("week");
          }}
          className="bg-yellow-500 px-3 py-1 rounded"
        >
          1 Week
        </button>

        <button
          onClick={() => {
            setFromDate("");
            setToDate("");
            setFilter("month");
          }}
          className="bg-yellow-500 px-3 py-1 rounded"
        >
          1 Month
        </button>

        <button
          onClick={() => {
            setFromDate("");
            setToDate("");
            setFilter("year");
          }}
          className="bg-yellow-500 px-3 py-1 rounded"
        >
          1 Year
        </button>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="bg-[#2a2a2a] border border-yellow-500 px-2 py-1 rounded"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="bg-[#2a2a2a] border border-yellow-500 px-2 py-1 rounded"
        />
      </div>

      {/* GRAPH */}

      <div className="bg-[#2a2a2a] p-5 rounded mb-5">
        <h2 className="text-center mb-4 text-lg">
          Customer Traffic
        </h2>

        <div className="h-[350px]">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : trafficData.length > 0 ? (
            <Line data={chartData} options={options} />
          ) : (
            <p className="text-center text-gray-400">
              No traffic data found
            </p>
          )}
        </div>
      </div>

      {/* POPULAR TABLES */}

      <div className="bg-[#2a2a2a] p-4 rounded mb-5 overflow-x-auto">
        <h2 className="text-lg mb-3 text-center">
          Popular Tables
        </h2>

        {loading ? (
          "Loading..."
        ) : (
          <table className="w-full text-center">
            <thead>
              <tr>
                <th className="pb-2">Table Number</th>
                <th className="pb-2">Bookings</th>
              </tr>
            </thead>

            <tbody>
              {popularTables.length > 0 ? (
                popularTables.map((t, i) => (
                  <tr key={i}>
                    <td className="py-2">{t.tableNumber}</td>
                    <td className="py-2">{t.totalBookings}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="py-4 text-gray-400">
                    No table data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* POPULAR DISHES */}

      <div className="bg-[#2a2a2a] p-4 rounded">
        <h2 className="text-lg mb-3 text-center">
          Popular Dishes
        </h2>

        {loading ? (
          "Loading..."
        ) : (
          <>
            <table className="w-full text-center">
              <thead>
                <tr>
                  <th className="pb-2">Dish</th>
                  <th className="pb-2">Total Sold</th>
                </tr>
              </thead>

              <tbody>
                {dishesToShow.length > 0 ? (
                  dishesToShow.map((d, i) => (
                    <tr key={i}>
                      <td className="py-2">{d._id}</td>
                      <td className="py-2">{d.totalDishCount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="py-4 text-gray-400">
                      No dish data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {dishStats.length > 5 && (
              <div className="text-center mt-3">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="bg-yellow-500 px-4 py-1 rounded"
                >
                  {showAll ? "Show Less" : "View All"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </section>
  );
};

export default Analysis;