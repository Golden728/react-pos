import React from "react";
import BottomNav from "../components/shared/BottomNav";
import Greetings from "../components/home/Greetings";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import MiniCard from "../components/home/MiniCard";
import RecentOrders from "../components/home/RecentOrders";
import PopularDishes from "../components/home/PopularDishes";

import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics } from "../https";

const Home = () => {

  // ✅ FORMAT FUNCTION
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const { data: dashboard = {}, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboardMetrics("1month"),
    refetchInterval: 3000,
  });

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex gap-3">

      {/* LEFT */}
      <div className="flex-[3]">
        <Greetings />

        <div className="flex gap-3 px-8 mt-8">

          <MiniCard
            title="Total Earnings (Month)"
            icon={<BsCashCoin />}
            number={
              isLoading
                ? "..."
                : formatCurrency(dashboard?.monthlyEarnings)
            }
            footerNum={1.6}
          />

          <MiniCard
            title="Yesterday Earnings"
            icon={<BsCashCoin />}
            number={
              isLoading
                ? "..."
                : formatCurrency(dashboard?.yesterdayEarnings)
            }
            footerNum={1.2}
          />

          <MiniCard
            title="In Progress"
            icon={<GrInProgress />}
            number={
              isLoading
                ? "..."
                : dashboard?.inProgressOrders || 0
            }
            footerNum={3.6}
          />

        </div>

        <RecentOrders />
      </div>

      {/* RIGHT */}
      <div className="flex-[2]">
        <PopularDishes dishes={dashboard?.popularDishes || []} />
      </div>

      <BottomNav />
    </section>
  );
};

export default Home;