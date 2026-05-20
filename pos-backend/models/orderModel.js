const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      guests: { type: String, required: true },
    },

    orderStatus: {
      type: String,
      enum: ["In Progress", "Ready", "Completed"],
      default: "In Progress",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },

    bills: {
      total: Number,
      tax: Number,
      totalWithTax: Number,
    },

    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
    },

    paymentData: {
      razorpay_order_id: String,
      razorpay_payment_id: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);