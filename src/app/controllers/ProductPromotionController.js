const ProductPromotion = require("../models/ProductPromotion");

class ProductPromotionController {
  async createProductPromotion(req, res) {
    try {
      const { product_id, promotion_id } = req.body;

      if (!product_id || !promotion_id) {
        return res
          .status(400)
          .json({ message: "product_id và promotion_id là bắt buộc" });
      }

      const productPromotion = new ProductPromotion({
        product_id,
        promotion_id,
      });

      await productPromotion.save();
      return res.status(201).json({
        message: "Tạo sản phẩm khuyến mãi thành công.",
        productPromotion,
      });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error });
    }
  }

  async getProductPromotions(req, res) {
    try {
      const productPromotions = await ProductPromotion.find()
        .populate({
          path: "product_id",
          select: "_id name",
        })
        .populate("promotion_id");

      return res.status(200).json(productPromotions);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error });
    }
  }

  async getProductPromotionById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ message: "ID ProductPromotion là bắt buộc" });
      }

      const productPromotion = await ProductPromotion.findById(id)
        .populate({
          path: "product_id",
          select: "_id",
        })
        .populate({
          path: "promotion_id",
          select: "_id status",
        });
      if (!productPromotion) {
        return res
          .status(404)
          .json({ message: "ProductPromotion không tồn tại" });
      }

      return res.status(200).json(productPromotion);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error });
    }
  }

  async updateProductPromotion(req, res) {
    try {
      const { id } = req.params;
      const { product_id, promotion_id } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ message: "ID ProductPromotion là bắt buộc" });
      }

      const productPromotion = await ProductPromotion.findById(id);

      if (!productPromotion) {
        return res
          .status(404)
          .json({ message: "ProductPromotion không tồn tại" });
      }

      // Cập nhật các trường
      if (product_id) productPromotion.product_id = product_id;
      if (promotion_id) productPromotion.promotion_id = promotion_id;

      await productPromotion.save();
      return res.status(200).json({
        message: "Cập nhật sản phẩm khuyến mãi thành công.",
        productPromotion,
      });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error });
    }
  }

  async deleteProductPromotion(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ message: "ID ProductPromotion là bắt buộc." });
      }

      const productPromotion = await ProductPromotion.findByIdAndDelete(id);
      if (!productPromotion) {
        return res
          .status(404)
          .json({ message: "ProductPromotion không tồn tại" });
      }

      return res.status(200).json({ message: "Xóa thành công." });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error });
    }
  }

  async getProductsByPromotionId(req, res) {
    try {
      const { promotion_id } = req.params;

      if (!promotion_id) {
        return res.status(400).json({ message: "promotion_id là bắt buộc" });
      }

      const productPromotions = await ProductPromotion.find({
        promotion_id,
      })
        .populate({
          path: "product_id",
        })
        .populate({
          path: "promotion_id",
          select: "start_date end_date status discount_value",
        });

      if (!productPromotions || productPromotions.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy sản phẩm cho promotion_id này" });
      }

      return res.status(200).json(productPromotions);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error });
    }
  }
}

module.exports = new ProductPromotionController();
