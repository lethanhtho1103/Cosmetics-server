const express = require("express");
const router = express.Router();

const commentController = require("../app/controllers/CommentController");

router.post("/", commentController.createComment);
router.get("/:product_id", commentController.getCommentsByProductId);
router.put("/:user_id/:product_id", commentController.updateComment);
router.delete("/:user_id/:product_id", commentController.deleteComment);

module.exports = router;
