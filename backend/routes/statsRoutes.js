const express = require("express");
const router = express.Router();

const {
    getStats,
    updateStats
} = require("../controllers/statsController");

router.get("/", getStats);
router.put("/", updateStats);

module.exports = router;