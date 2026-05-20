const Order = require("../models/orderModel");
const Table = require("../models/tableModel");

const getDashboardMetrics = async (req, res, next) => {
  try {
    const filter = req.query.filter || "all";
    let dateFilter = {};
    const now = new Date();

    // ================= FILTER =================
    if (filter === "7days") {
      const last7Days = new Date();
      last7Days.setDate(now.getDate() - 7);
      dateFilter = { createdAt: { $gte: last7Days } };
    } 
    else if (filter === "1month") {
      const lastMonth = new Date();
      lastMonth.setMonth(now.getMonth() - 1);
      dateFilter = { createdAt: { $gte: lastMonth } };
    } 
    else if (filter === "1year") {
      const lastYear = new Date();
      lastYear.setFullYear(now.getFullYear() - 1);
      dateFilter = { createdAt: { $gte: lastYear } };
    }

    // ================= COMPLETED ORDERS =================
    const completedOrders = await Order.find({
      orderStatus: "Completed",
      ...dateFilter
    });

    // ================= TOTAL EARNINGS =================
    const totalEarnings = completedOrders.reduce(
      (sum, order) => sum + (order.bills.totalWithTax || 0),
      0
    );

    // ================= IN PROGRESS =================
    const inProgressOrders = await Order.countDocuments({
      orderStatus: "In Progress",
    });

    // ================= YESTERDAY EARNINGS =================
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterdayOrders = await Order.find({
      orderStatus: "Completed",
      createdAt: { $gte: yesterday, $lt: today }
    });

    const yesterdayEarnings = yesterdayOrders.reduce(
      (sum, order) => sum + (order.bills.totalWithTax || 0),
      0
    );

    // ================= THIS MONTH EARNINGS =================
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthOrders = await Order.find({
      orderStatus: "Completed",
      createdAt: { $gte: firstDayOfMonth }
    });

    const monthlyEarnings = monthOrders.reduce(
      (sum, order) => sum + (order.bills.totalWithTax || 0),
      0
    );

    // ================= POPULAR DISHES =================
    const dishMap = {};

    completedOrders.forEach(order => {
      order.items.forEach(item => {
        if (!dishMap[item.name]) {
          dishMap[item.name] = 0;
        }
        dishMap[item.name] += item.quantity;
      });
    });

    const popularDishes = Object.entries(dishMap)
      .map(([name, totalOrders]) => ({ name, totalOrders }))
      .sort((a, b) => b.totalOrders - a.totalOrders)
      .slice(0, 10);

    // ================= RESPONSE =================
    res.json({
      success: true,
      data: {
        totalEarnings,
        inProgressOrders,
        yesterdayEarnings,
        monthlyEarnings,
        popularDishes,
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardMetrics };