const express = require("express");
const router = express.Router();

const statistics = require("../app/controllers/Statistics");

router.get("/", statistics.statistics);
router.get("/order/month", statistics.getOrderStatisticsByMonth);

module.exports = router;
