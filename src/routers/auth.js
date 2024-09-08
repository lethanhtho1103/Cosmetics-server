const express = require("express");
const router = express.Router();

const authController = require("../app/controllers/AuthController");
const userMiddleware = require("../middlewares/userMiddleware");

router.post("/register", authController.register);
router.post("/login-user", authController.loginUser);
router.put("/update-user/:id", authController.updateUser);
router.post("/logout", userMiddleware.verifyToken, authController.logoutUser);
router.post("/refresh", authController.requestRefreshToken);

module.exports = router;
