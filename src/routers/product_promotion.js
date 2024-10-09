const express = require("express");
const router = express.Router();

const productPromotionController = require("../app/controllers/ProductPromotionController");

router.post("/", productPromotionController.createProductPromotion);
router.get("/", productPromotionController.getProductPromotions);
router.get("/:id", productPromotionController.getProductPromotionById);
router.put("/:id", productPromotionController.updateProductPromotion);
router.delete("/:id", productPromotionController.deleteProductPromotion);
router.get(
  "/promotion_id/:promotion_id",
  productPromotionController.getProductsByPromotionId
);

module.exports = router;
