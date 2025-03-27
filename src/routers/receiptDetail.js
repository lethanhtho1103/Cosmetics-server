const express = require("express");
const router = express.Router();
const userMiddleware = require("../middlewares/userMiddleware");
const receiptController = require("../app/controllers/ReceiptController");

router.put("/", userMiddleware.verifyAdminToken, receiptController.updateReceiptDetail);
router.delete("/:receiptDetailId", userMiddleware.verifyAdminToken, receiptController.deleteReceiptDetail);
router.get("/:receiptDetailId", userMiddleware.verifyAdminToken, receiptController.getReceiptDetailById);

module.exports = router;
