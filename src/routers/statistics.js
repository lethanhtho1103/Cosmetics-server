const express = require("express");
const router = express.Router();
const userMiddleware = require("../middlewares/userMiddleware");

const statistics = require("../app/controllers/Statistics");

router.get("/", userMiddleware.verifyAdminToken, statistics.statistics);
router.get("/top-categories-sales", userMiddleware.verifyAdminToken, statistics.getTopCategoriesBySales);
router.get("/top-products-sales", userMiddleware.verifyAdminToken, statistics.getTopProductsBySales);
router.get("/order/month", userMiddleware.verifyAdminToken, statistics.getOrderStatisticsByMonth);
router.get("/order/year", userMiddleware.verifyAdminToken, statistics.getOrderStatisticsByYear);

module.exports = router;
