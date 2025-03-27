const express = require("express");
const router = express.Router();
const userMiddleware = require("../middlewares/userMiddleware");

const supplierController = require("../app/controllers/SupplierController");

router.post("/", userMiddleware.verifyAdminToken, supplierController.createSupplier);
router.get("/", userMiddleware.verifyAdminToken, supplierController.getAllSuppliers);
router.get("/:id", userMiddleware.verifyAdminToken, supplierController.getSupplierById);
router.put("/:id", userMiddleware.verifyAdminToken, supplierController.updateSupplier);
router.delete("/:id", userMiddleware.verifyAdminToken, supplierController.deleteSupplier);

module.exports = router;
