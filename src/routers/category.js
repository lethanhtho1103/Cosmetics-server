const express = require("express");
const router = express.Router();
const userMiddleware = require("../middlewares/userMiddleware");
const categoryController = require("../app/controllers/CategoryController");

router.post("/", categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", userMiddleware.verifyAdminToken, categoryController.getCategoryById);
router.put("/:id",  userMiddleware.verifyAdminToken, categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
