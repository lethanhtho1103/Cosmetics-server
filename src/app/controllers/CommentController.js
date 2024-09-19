const mongoose = require("mongoose");
const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetail");
const Product = require("../models/Product");
const Comment = require("../models/Comment");

class CommentController {
  async createComment(req, res) {
    const { user_id, product_id, star, content } = req.body;

    try {
      const orders = await Order.find({ user_id });

      if (!orders || orders.length === 0) {
        return res
          .status(400)
          .json({ message: "Người dùng chưa đặt đơn hàng nào." });
      }

      const orderIds = orders.map((order) => order._id);
      const orderDetail = await OrderDetail.findOne({
        order_id: { $in: orderIds },
        product_id,
      });

      if (!orderDetail) {
        return res
          .status(400)
          .json({ message: "Người dùng chưa đặt mua sản phẩm này." });
      }

      let existingComment = await Comment.findOne({
        user_id,
        product_id,
      });

      if (existingComment) {
        existingComment.star = star;
        existingComment.content = content;
        await existingComment.save();

        const comments = await Comment.find({ product_id });
        const averageStar =
          comments.reduce((acc, comment) => acc + comment.star, 0) /
          comments.length;

        await Product.findByIdAndUpdate(product_id, {
          average_star: averageStar,
        });

        return res
          .status(200)
          .json({ message: "Cập nhật đánh giá thành công." });
      }

      const newComment = new Comment({
        user_id,
        product_id,
        star,
        content,
      });

      await newComment.save();

      const comments = await Comment.find({ product_id });
      const averageStar =
        comments.reduce((acc, comment) => acc + comment.star, 0) /
        comments.length;
      const commentCount = comments.length;

      await Product.findByIdAndUpdate(product_id, {
        average_star: averageStar,
        comment_count: commentCount,
      });

      res
        .status(201)
        .json({ message: "Cảm ơn bạn đã đánh giá sản phẩm của chúng tôi." });
    } catch (error) {
      res.status(500).json({ message: "Có lỗi xảy ra.", error });
    }
  }

  async getCommentsByProductId(req, res) {
    const { product_id } = req.params;
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(product_id)) {
      return res.status(400).json({ message: "ID sản phẩm không hợp lệ." });
    }
    try {
      const comments = await Comment.find({ product_id })
        .sort({ comment_date: -1 })
        .populate("user_id", "username avatar");
      res.status(200).json({ data: comments });
    } catch (error) {
      res.status(500).json({ message: "Có lỗi xảy ra.", error });
    }
  }

  async deleteComment(req, res) {
    const { user_id, product_id } = req.params;
    try {
      const comment = await Comment.findOne({ user_id, product_id });
      if (!comment) {
        return res.status(404).json({ message: "Không tìm thấy đánh giá." });
      }
      // Xóa comment
      await Comment.findByIdAndDelete(comment._id);

      // Tính lại số sao trung bình và số lượng đánh giá
      const comments = await Comment.find({ product_id });
      const totalStars = comments.reduce(
        (acc, comment) => acc + comment.star,
        0
      );
      const commentCount = comments.length;

      // Tính lại số sao trung bình (tránh NaN)
      const averageStar = commentCount > 0 ? totalStars / commentCount : 0;

      // Cập nhật sản phẩm với số sao trung bình và số lượng đánh giá mới
      await Product.findByIdAndUpdate(product_id, {
        average_star: averageStar,
        comment_count: commentCount,
      });

      res.status(200).json({ message: "Xóa đánh giá thành công." });
    } catch (error) {
      res.status(500).json({ message: "Có lỗi xảy ra.", error });
    }
  }

  async updateComment(req, res) {
    const { user_id, product_id } = req.params;
    const { star, content } = req.body;

    try {
      // Tìm comment hiện có của người dùng cho sản phẩm
      const existingComment = await Comment.findOne({
        user_id,
        product_id,
      });

      if (!existingComment) {
        return res.status(404).json({ message: "Đánh giá không tồn tại." });
      }

      // Cập nhật thông tin comment
      existingComment.star = star;
      existingComment.content = content;
      existingComment.comment_date = Date.now();
      await existingComment.save();

      const comments = await Comment.find({ product_id });
      const averageStar =
        comments.reduce((acc, comment) => acc + comment.star, 0) /
        comments.length;

      await Product.findByIdAndUpdate(product_id, {
        average_star: averageStar,
      });

      return res.status(200).json({ message: "Cập nhật đánh giá thành công." });
    } catch (error) {
      return res.status(500).json({ message: "Có lỗi xảy ra.", error });
    }
  }
}

module.exports = new CommentController();
