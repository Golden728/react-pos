const Order = require("../models/orderModel");

const getAnalysisData = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate
      ? new Date(startDate)
      : new Date("2000-01-01");

    const end = endDate
      ? new Date(endDate)
      : new Date();

    // ================= POPULAR DISHES =================

    const dishStats = await Order.aggregate([
      {
        $match: {
          orderDate: {
            $gte: start,
            $lte: end,
          },
        },
      },

      {
        $unwind: "$items",
      },

      {
        $group: {
          _id: "$items.name",
          totalDishCount: {
            $sum: "$items.quantity",
          },
        },
      },

      {
        $sort: {
          totalDishCount: -1,
        },
      },
    ]);

    // ================= POPULAR TABLES =================

    const popularTables = await Order.aggregate([
      {
        $match: {
          orderDate: {
            $gte: start,
            $lte: end,
          },
        },
      },

      {
        $group: {
          _id: "$table",
          totalBookings: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          totalBookings: -1,
        },
      },

      {
        $limit: 5,
      },

      {
        $lookup: {
          from: "tables",
          localField: "_id",
          foreignField: "_id",
          as: "tableInfo",
        },
      },

      {
        $unwind: "$tableInfo",
      },

      {
        $project: {
          _id: 0,
          tableNumber: "$tableInfo.tableNo",
          totalBookings: 1,
        },
      },
    ]);

    // ================= CUSTOMER TRAFFIC =================

    const customerTraffic = await Order.aggregate([
      {
        $match: {
          orderDate: {
            $gte: start,
            $lte: end,
          },
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$orderDate",
            },
          },

          customers: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    console.log("Dish Stats:", dishStats);
    console.log("Popular Tables:", popularTables);
    console.log("Customer Traffic:", customerTraffic);

    res.status(200).json({
      success: true,
      data: {
        dishStats,
        popularTables,
        customerTraffic,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  getAnalysisData,
};