const express = require("express");
const router = express.Router();

const { printHandler } = require("../controllers/printController");

router.post("/", printHandler);

module.exports = router;