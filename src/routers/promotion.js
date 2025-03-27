const express = require("express");
const router = express.Router();

const promotionController = require("../app/controllers/PromotionController");

router.post("/", userMiddleware.verifyAdminToken, promotionController.createPromotion);
router.get("/", userMiddleware.verifyAdminToken, promotionController.getPromotions);
router.get("/:id", userMiddleware.verifyAdminToken, promotionController.getPromotionById);
router.put("/:id", userMiddleware.verifyAdminToken, promotionController.updatePromotion);
router.delete("/:id", userMiddleware.verifyAdminToken, promotionController.deletePromotion);

module.exports = router;
