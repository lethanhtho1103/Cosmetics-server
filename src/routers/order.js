const express = require("express");
const router = express.Router();

const orderController = require("../app/controllers/OrderController");

// router.post("/", orderController.sendEmail);
router.post("/", orderController.createOrder);
router.get("/users", orderController.getAllOrders);
router.put("/update/status", orderController.updateOrderStatus);
router.put("/update/is-payment", orderController.updatePaymentStatus);
router.get("/user/:userId", orderController.getAllOrdersByUserId);
router.get("/:orderId", orderController.getOrderById);

module.exports = router;
