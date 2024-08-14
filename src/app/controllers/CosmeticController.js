const Cosmetic = require("../models/Cosmetic");
const Category = require("../models/Category");
const Shop = require("../models/Shop");

class CosmeticController {
  async createCosmetic(req, res, next) {
    try {
      const { name, shop_id } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }
      if (shop_id) {
        const shopExists = await Shop.findById(shop_id);
        if (!shopExists) {
          return res.status(400).json({ message: "Invalid shop_id" });
        }
      }
      const newCosmetic = new Cosmetic({
        name,
        shop_id,
      });
      await newCosmetic.save();
      return res.status(200).json({
        message: `Cosmetic created successfully: ${name}.`,
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
        return res.status(404).json({ message: "Cosmetic not found" });
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

      const cosmetic = await Cosmetic.findById(CosmeticId);
      if (!cosmetic) {
        return res.status(404).json({ message: "Cosmetic not found" });
      }
      if (name) cosmetic.name = name;

      await cosmetic.save();
      return res.status(200).json({
        message: `Cosmetic updated successfully: ${cosmetic.name}.`,
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
        return res.status(404).json({ message: "Cosmetic not found" });
      }

      return res.status(200).json({
        message: `Cosmetic deleted successfully: ${deletedCosmetic.name}.`,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CosmeticController();
