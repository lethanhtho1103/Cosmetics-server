const express = require("express");
const router = express.Router();
const userMiddleware = require("../middlewares/userMiddleware");
const cartController = require("../app/controllers/CartController");

router.post("/", userMiddleware.verifyToken, cartController.addToCart);
router.post("/products", userMiddleware.verifyToken, cartController.addProductsToCart);
router.get("/:userId", userMiddleware.verifyToken, cartController.getCart);
router.put("/", userMiddleware.verifyToken, cartController.updateCartItem);
router.delete("/", userMiddleware.verifyToken, cartController.removeCartItem);

module.exports = router;
