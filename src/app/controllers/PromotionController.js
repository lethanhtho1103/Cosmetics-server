const Promotion = require("../models/Promotion");

class PromotionController {
  async createPromotion(req, res) {
    try {
      const { name, discount_type, discount_value, start_date, end_date } =
        req.body;

      if (!name || !discount_type || !start_date || !end_date) {
        return res
          .status(400)
          .json({ message: "Tất cả các trường đều bắt buộc" });
      }

      if (!["percent", "fixed", "buy_one_get_one"].includes(discount_type)) {
        return res
          .status(400)
          .json({ message: "Loại khuyến mãi không hợp lệ" });
      }

      if (
        ["percent", "fixed"].includes(discount_type) &&
        (!discount_value || discount_value <= 0)
      ) {
        return res.status(400).json({
          message:
            "Giá trị giảm giá phải lớn hơn 0 đối với loại phần trăm hoặc cố định",
        });
      }

      if (new Date(start_date) >= new Date(end_date)) {
        return res
          .status(400)
          .json({ message: "Ngày kết thúc phải sau ngày bắt đầu" });
      }

      const promotion = new Promotion({
        name,
        discount_type,
        discount_value:
          discount_type === "buy_one_get_one" ? undefined : discount_value,
        start_date,
        end_date,
        status: "inactive",
      });

      return res.status(201).json({
        message: "Tạo khuyễn mãi thành công.",
        promotion: promotion,
      });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi máy chủ", error });
    }
  }

  async getPromotions(req, res) {
    try {
      const promotions = await Promotion.find();
      return res.status(200).json(promotions);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi máy chủ", error });
    }
  }

  async getPromotionById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID khuyến mãi là bắt buộc" });
      }
      const promotion = await Promotion.findById(id);

      if (!promotion) {
        return res.status(404).json({ message: "Không tìm thấy khuyến mãi" });
      }
      return res.status(200).json(promotion);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi máy chủ", error });
    }
  }

  async updatePromotion(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        discount_type,
        discount_value,
        start_date,
        end_date,
        status,
      } = req.body;

      if (!id) {
        return res.status(400).json({ message: "ID khuyến mãi là bắt buộc" });
      }

      const promotion = await Promotion.findById(id);

      if (!promotion) {
        return res.status(404).json({ message: "Không tìm thấy khuyến mãi" });
      }

      if (name) promotion.name = name;
      if (discount_type && ["percent", "fixed"].includes(discount_type)) {
        promotion.discount_type = discount_type;
      }
      if (discount_value && discount_value > 0)
        promotion.discount_value = discount_value;
      if (start_date && new Date(start_date) < new Date(end_date))
        promotion.start_date = start_date;
      if (end_date && new Date(start_date) < new Date(end_date))
        promotion.end_date = end_date;
      if (status && ["active", "inactive", "expired"].includes(status))
        promotion.status = status;

      return res.status(200).json({
        message: "Cập nhật thành công.",
        promotion,
      });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi máy chủ", error });
    }
  }

  async deletePromotion(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "ID khuyến mãi là bắt buộc" });
      }

      const promotion = await Promotion.findByIdAndDelete(id);

      if (!promotion) {
        return res.status(404).json({ message: "Không tìm thấy khuyến mãi" });
      }

      return res.status(200).json({ message: "Xóa khuyến mãi thành công" });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi máy chủ", error });
    }
  }
}

module.exports = new PromotionController();
