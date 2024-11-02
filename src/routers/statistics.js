const express = require("express");
const router = express.Router();

const statistics = require("../app/controllers/Statistics");

router.get("/", statistics.statistics);
router.get("/top-categories-sales", statistics.getTopCategoriesBySales);
router.get("/top-products-sales", statistics.getTopProductsBySales);
router.get("/order/month", statistics.getOrderStatisticsByMonth);
router.get("/order/year", statistics.getOrderStatisticsByYear);

module.exports = router;
