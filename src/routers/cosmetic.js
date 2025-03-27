const express = require("express");
const router = express.Router();
const userMiddleware = require("../middlewares/userMiddleware");

const cosmeticController = require("../app/controllers/CosmeticController");

router.post("/", cosmeticController.createCosmetic);
router.get("/", cosmeticController.getAllCosmetic);
router.get("/:id", cosmeticController.getCosmeticById);
router.put("/:id", cosmeticController.updateCosmetic);
router.delete("/:id", cosmeticController.deleteCosmetic);

module.exports = router;
