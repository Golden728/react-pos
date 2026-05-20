const createHttpError = require("http-errors");
const Order = require("../models/orderModel");
const mongoose = require("mongoose");

/* ================= CREATE ORDER ================= */
const addOrder = async (req, res, next) => {
  try {
    const order = new Order({
      ...req.body,
      paymentStatus: req.body.paymentStatus || "Pending",
      orderStatus: req.body.orderStatus || "In Progress",
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order created!",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= GET ALL ORDERS ================= */
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("table")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= GET ORDER BY ID ================= */
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(404, "Invalid Id"));
    }

    const order = await Order.findById(id).populate("table");

    if (!order) {
      return next(createHttpError(404, "Order not found"));
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= UPDATE ORDER ================= */
const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(404, "Invalid Id"));
    }

    const updateData = {};

    // ✅ Update order status
    if (orderStatus) {
      updateData.orderStatus = orderStatus;

      // 🔥 AUTO PAYMENT IF COMPLETED
      if (orderStatus === "Completed") {
        updateData.paymentStatus = "Paid";
      }
    }

    // ✅ Manual payment update
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    const order = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!order) {
      return next(createHttpError(404, "Order not found"));
    }

    res.status(200).json({
      success: true,
      message: "Order updated",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addOrder,
  getOrders,
  getOrderById,
  updateOrder,
};