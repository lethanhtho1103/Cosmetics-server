const express = require("express");
const router = express.Router();
const userMiddleware = require("../middlewares/userMiddleware");
const receiptController = require("../app/controllers/ReceiptController");

router.post("/", userMiddleware.verifyAdminToken, receiptController.createReceipt);
router.get("/", userMiddleware.verifyAdminToken, receiptController.getReceipts);
router.get("/:id", userMiddleware.verifyAdminToken, receiptController.getReceiptById);

module.exports = router;
