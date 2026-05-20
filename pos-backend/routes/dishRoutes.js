const express = require("express");
const router = express.Router();

const {
  addDish,
  getDishesByCategory,
  updateDish,
  deleteDish,
  getPopularDishes, // ✅ ADD THIS
} = require("../controllers/dishController");

// ✅ CREATE
router.post("/", addDish);

// ✅ POPULAR (MUST BE ABOVE :categoryId)
router.get("/popular", getPopularDishes);

// ✅ GET BY CATEGORY
router.get("/:categoryId", getDishesByCategory);

// ✅ UPDATE
router.put("/:dishId", updateDish);

// ✅ DELETE
router.delete("/:dishId", deleteDish);

module.exports = router;