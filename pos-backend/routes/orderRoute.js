const express = require("express");
const router = express.Router();

const {
  addOrder,
  getOrders,
  getOrderById,
  updateOrder,
} = require("../controllers/orderController");

const { isVerifiedUser } = require("../middlewares/tokenVerification");

// CREATE ORDER
router.post("/", isVerifiedUser, addOrder);

// GET ALL ORDERS
router.get("/", isVerifiedUser, getOrders);

// GET ORDER BY ID
router.get("/:id", isVerifiedUser, getOrderById);

// UPDATE ORDER (🔥 IMPORTANT)
router.put("/:id", isVerifiedUser, updateOrder);

module.exports = router;