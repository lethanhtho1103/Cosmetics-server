const express = require("express");
const router = express.Router();

const promotionController = require("../app/controllers/PromotionController");

router.post("/", promotionController.createPromotion);
router.get("/", promotionController.getPromotions);
router.get("/:id", promotionController.getPromotionById);
router.put("/:id", promotionController.updatePromotion);
router.delete("/:id", promotionController.deletePromotion);

module.exports = router;
