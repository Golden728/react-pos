const express = require("express");

const router = express.Router();

const {

  getAnalysisData

} = require("../controllers/analysisController");


router.get("/", getAnalysisData);


module.exports = router;