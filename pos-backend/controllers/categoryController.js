const Category = require("../models/categoryModel");

// ➕ Add Category
exports.addCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name });

    res.status(201).json({
      success: true,
      message: "Category added",
      data: category
    });
  } catch (err) {
    next(err);
  }
};

// 📥 Get All Categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (err) {
    next(err);
  }
};