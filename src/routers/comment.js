const express = require("express");
const router = express.Router();
const userMiddleware = require("../middlewares/userMiddleware");
const commentController = require("../app/controllers/CommentController");

router.post("/", userMiddleware.verifyToken, commentController.createComment);
router.get("/:product_id", userMiddleware.verifyToken, commentController.getCommentsByProductId);
router.put("/:user_id/:product_id", userMiddleware.verifyToken, commentController.updateComment);
router.delete("/:user_id/:product_id", userMiddleware.verifyToken, commentController.deleteComment);

module.exports = router;
