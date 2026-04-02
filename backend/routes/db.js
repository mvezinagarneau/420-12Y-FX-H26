const express = require("express");
const router = express.Router();
const dbController = require("../controllers/dbController");

router.post("/seed", dbController.seed);

module.exports = router;
