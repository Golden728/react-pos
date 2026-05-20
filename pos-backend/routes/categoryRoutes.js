const express = require("express");
const router = express.Router();
const Category = require("../models/categoryModel");

// GET ALL
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    // ✅ IMPORTANT: return array directly
    res.json(categories);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD CATEGORY
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    const category = new Category({ name });
    await category.save();

    res.status(201).json(category);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;