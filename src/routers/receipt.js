const express = require("express");
const router = express.Router();

const receiptController = require("../app/controllers/ReceiptController");

router.post("/", receiptController.createReceipt);
router.get("/", receiptController.getReceipts);
router.get("/:id", receiptController.getReceiptById);

module.exports = router;
