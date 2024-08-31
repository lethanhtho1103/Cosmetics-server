const express = require("express");
const router = express.Router();

const cartController = require("../app/controllers/CartController");

router.post("/", cartController.addToCart);
router.post("/products", cartController.addProductsToCart);
router.get("/:userId", cartController.getCart);
router.put("/", cartController.updateCartItem);
router.delete("/", cartController.removeCartItem);

module.exports = router;
