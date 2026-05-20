const createHttpError = require("http-errors");
const config = require("../config/config");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const isVerifiedUser = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return next(createHttpError(401, "No token provided"));
    }

    const decoded = jwt.verify(token, config.accessTokenSecret);

    const user = await User.findById(decoded._id);

    if (!user) {
      return next(createHttpError(401, "User not found"));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(createHttpError(401, "Invalid token"));
  }
};

module.exports = { isVerifiedUser };