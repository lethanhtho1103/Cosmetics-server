const express = require("express");
const router = express.Router();

const authController = require("../app/controllers/AuthController");
const userMiddleware = require("../middlewares/userMiddleware");

router.post("/register", authController.register);
router.post("/register-admin", authController.registerAdmin);
router.post("/login-user", authController.loginUser);
router.post("/login-admin", authController.loginAdmin);
router.put("/update-user/:id", authController.updateUser);
router.post("/logout", userMiddleware.verifyToken, authController.logoutUser);
router.post("/refresh", authController.requestRefreshToken);

module.exports = router;
