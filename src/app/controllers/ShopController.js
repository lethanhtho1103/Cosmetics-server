const Shop = require("../models/Shop");
const Cosmetic = require("../models/Cosmetic");

class ShopController {
  async createShop(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }
      const newShop = new Shop({
        name,
      });
      await newShop.save();
      return res.status(200).json({
        message: `Shop created successfully: ${name}.`,
        data: newShop,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAllShop(req, res) {
    try {
      const shops = await Shop.find();
      const ShopsWithCosmetics = await Promise.all(
        shops.map(async (shop) => {
          const Cosmetics = await Cosmetic.find({
            shop_id: shop._id,
          });
          return {
            ...shop._doc,
            Cosmetics,
          };
        })
      );

      // Return the result
      return res.status(200).json(ShopsWithCosmetics);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getShopById(req, res) {
    try {
      const shopId = req.params.id;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      const cosmetics = await Cosmetic.find({ shop_id: shop._id });
      const shopWithCosmetics = {
        ...shop._doc,
        cosmetics,
      };
      return res.status(200).json(shopWithCosmetics);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateShop(req, res, next) {
    try {
      const shopId = req.params.id;
      const name = req.body.name;

      const shop = await Shop.findById(shopId);
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      if (name) shop.name = name;

      await shop.save();
      return res.status(200).json({
        message: `Shop updated successfully: ${shop.name}.`,
        data: shop,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteShop(req, res, next) {
    try {
      const { id } = req.params;
      const deletedShop = await Shop.findByIdAndDelete(id);

      if (!deletedShop) {
        return res.status(404).json({ message: "Shop not found" });
      }

      return res.status(200).json({
        message: `Shop deleted successfully: ${deletedShop.name}.`,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ShopController();
