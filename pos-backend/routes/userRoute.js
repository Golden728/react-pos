const express = require("express");
const router = express.Router();
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const {
  register,
  login,
  getUserData,
  logout,
} = require("../controllers/userController");

// AUTH
router.post("/register", register);
router.post("/login", login);

// ❌ REMOVE isVerifiedUser HERE
router.post("/logout", logout);

// PROTECTED
router.get("/", isVerifiedUser, getUserData);

module.exports = router;