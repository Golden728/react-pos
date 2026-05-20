const Dish = require("../models/dishModel");
const Order = require("../models/orderModel");
const createHttpError = require("http-errors");
const mongoose = require("mongoose");

// ➕ ADD DISH
exports.addDish = async (req, res, next) => {
  try {
    const { name, price, categoryId, tags } = req.body;

    if (!name || !price || !categoryId) {
      return next(createHttpError(400, "All fields are required"));
    }

    const dish = await Dish.create({
  name,
  price,
  category: categoryId,
  tags: tags || [], // ✅ optional
});

    res.status(201).json({
      success: true,
      message: "Dish added successfully",
      data: dish,
    });
  } catch (err) {
    next(err);
  }
};

// 📥 GET ALL DISHES (FOR MENU)
exports.getAllDishes = async (req, res, next) => {
  try {
    const dishes = await Dish.find().populate("category");

    res.status(200).json({
      success: true,
      data: dishes,
    });
  } catch (err) {
    next(err);
  }
};

// 📥 GET DISHES BY CATEGORY
exports.getDishesByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return next(createHttpError(400, "Invalid category ID"));
    }

    const dishes = await Dish.find({ category: categoryId });

    res.status(200).json({
      success: true,
      data: dishes,
    });
  } catch (err) {
    next(err);
  }
};

// ✏️ UPDATE DISH PRICE
exports.updateDish = async (req, res, next) => {
  try {
    const { dishId } = req.params;
    const { price } = req.body;

    if (!mongoose.Types.ObjectId.isValid(dishId)) {
      return next(createHttpError(400, "Invalid dish ID"));
    }

    const dish = await Dish.findByIdAndUpdate(
      dishId,
      { price },
      { new: true }
    );

    if (!dish) {
      return next(createHttpError(404, "Dish not found"));
    }

    res.status(200).json({
      success: true,
      message: "Dish updated",
      data: dish,
    });
  } catch (err) {
    next(err);
  }
};

// ❌ DELETE DISH
exports.deleteDish = async (req, res, next) => {
  try {
    const { dishId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(dishId)) {
      return next(createHttpError(400, "Invalid dish ID"));
    }

    const dish = await Dish.findByIdAndDelete(dishId);

    if (!dish) {
      return next(createHttpError(404, "Dish not found"));
    }

    res.status(200).json({
      success: true,
      message: "Dish deleted",
    });
  } catch (err) {
    next(err);
  }
};

// 🔥 GET POPULAR DISHES (FROM ORDERS)
exports.getPopularDishes = async (req, res, next) => {
  try {
    const result = await Order.aggregate([
      { $unwind: "$items" },

      {
        $group: {
          _id: "$items.dish",
          totalOrders: { $sum: "$items.quantity" },
        },
      },

      {
        $lookup: {
          from: "dishes",
          localField: "_id",
          foreignField: "_id",
          as: "dish",
        },
      },

      { $unwind: "$dish" },

      {
        $project: {
          _id: "$dish._id",
          name: "$dish.name",
          price: "$dish.price",
          totalOrders: 1,
        },
      },

      { $sort: { totalOrders: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};