const Cosmetic = require("../models/Cosmetic");
const Category = require("../models/Category");
const Shop = require("../models/Shop");

class CosmeticController {
  async createCosmetic(req, res, next) {
    try {
      const { name, shop_id } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Tên là bắt buộc" });
      }
      if (shop_id) {
        const shopExists = await Shop.findById(shop_id);
        if (!shopExists) {
          return res.status(400).json({ message: "Mã cửa hàng không hợp lệ" });
        }
      }
      const newCosmetic = new Cosmetic({
        name,
        shop_id,
      });
      await newCosmetic.save();
      return res.status(200).json({
        message: `Tạo danh mục thành công: ${name}.`,
        data: newCosmetic,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAllCosmetic(req, res) {
    try {
      const cosmetics = await Cosmetic.find();
      const cosmeticsWithCategories = await Promise.all(
        cosmetics.map(async (cosmetic) => {
          const categories = await Category.find({
            cosmetic_id: cosmetic._id,
          });
          return {
            ...cosmetic._doc,
            categories,
          };
        })
      );

      // Return the result
      return res.status(200).json(cosmeticsWithCategories);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getCosmeticById(req, res) {
    try {
      const cosmeticId = req.params.id;
      const cosmetic = await Cosmetic.findById(cosmeticId);
      if (!cosmetic) {
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }
      const categories = await Category.find({ cosmetic_id: cosmetic._id });
      const cosmeticWithCategories = {
        ...cosmetic._doc,
        categories,
      };
      return res.status(200).json(cosmeticWithCategories);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateCosmetic(req, res, next) {
    try {
      const CosmeticId = req.params.id;
      const name = req.body.name;
      const shop_id = req.body.shop_id;

      const cosmetic = await Cosmetic.findById(CosmeticId);
      if (!cosmetic) {
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }
      if (name) cosmetic.name = name;
      if (shop_id) cosmetic.shop_id = shop_id;

      await cosmetic.save();
      return res.status(200).json({
        message: `Cập nhật danh mục thành công: ${cosmetic.name}.`,
        data: cosmetic,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteCosmetic(req, res, next) {
    try {
      const { id } = req.params;
      const deletedCosmetic = await Cosmetic.findByIdAndDelete(id);

      if (!deletedCosmetic) {
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }

      return res.status(200).json({
        message: `Xóa danh mục thành công: ${deletedCosmetic.name}.`,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CosmeticController();
