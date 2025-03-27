const express = require("express");
const router = express.Router();

const userMiddleware = require("../middlewares/userMiddleware");
const orderController = require("../app/controllers/OrderController");

// router.post("/", orderController.sendEmail);
router.post("/", userMiddleware.verifyToken, orderController.createOrder);
router.get("/users", userMiddleware.verifyAdminToken, orderController.getAllOrders);
router.put("/update/status", userMiddleware.verifyAdminToken, orderController.updateOrderStatus);
router.put("/update/is-payment", userMiddleware.verifyAdminToken, orderController.updatePaymentStatus);
router.get("/user/:userId", userMiddleware.verifyAdminToken, orderController.getAllOrdersByUserId);
router.get("/:orderId", userMiddleware.verifyAdminToken, orderController.getOrderById);

module.exports = router;
