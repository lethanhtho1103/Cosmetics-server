const express = require("express");
const router = express.Router();

const authController = require("../app/controllers/AuthController");
const userMiddleware = require("../middlewares/userMiddleware");

router.post("/register", authController.register);
router.post("/login-user", authController.loginUser);
router.post("/logout", userMiddleware.verifyToken, authController.logoutUser);

module.exports = router;
