const express = require("express");
const router = express.Router();

const receiptController = require("../app/controllers/ReceiptController");

router.put("/", receiptController.updateReceiptDetail);
router.delete("/:receiptDetailId", receiptController.deleteReceiptDetail);
router.get("/:receiptDetailId", receiptController.getReceiptDetailById);

module.exports = router;
