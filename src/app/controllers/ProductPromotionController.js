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
      return res.status(201).json(productPromotion);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error });
    }
  }

  async getProductPromotions(req, res) {
    try {
      const productPromotions = await ProductPromotion.find()
        .populate("product_id")
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
        .populate("product_id")
        .populate("promotion_id");

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

      // Tìm mối quan hệ khuyến mãi cần cập nhật
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
      return res.status(200).json(productPromotion);
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
          .json({ message: "ID ProductPromotion là bắt buộc" });
      }

      const productPromotion = await ProductPromotion.findByIdAndDelete(id);
      if (!productPromotion) {
        return res
          .status(404)
          .json({ message: "ProductPromotion không tồn tại" });
      }

      return res
        .status(200)
        .json({ message: "Xóa ProductPromotion thành công" });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error });
    }
  }
}

module.exports = new ProductPromotionController();
