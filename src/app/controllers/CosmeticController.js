const Cosmetic = require("../models/Cosmetic");
const Category = require("../models/Category");

class CosmeticController {
  async createCosmetic(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }
      const newCosmetic = new Cosmetic({
        name,
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
        cosmetics.map(async (Cosmetic) => {
          const categories = await Category.find({
            Cosmetic_id: Cosmetic._id,
          });
          return {
            ...Cosmetic._doc,
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
      const CosmeticId = req.params.id;
      const Cosmetic = await Cosmetic.findById(CosmeticId);
      if (!Cosmetic) {
        return res.status(404).json({ message: "Cosmetic not found" });
      }
      const categories = await Category.find({ Cosmetic_id: Cosmetic._id });
      const CosmeticWithCategories = {
        ...Cosmetic._doc,
        categories,
      };
      return res.status(200).json(CosmeticWithCategories);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateCosmetic(req, res, next) {
    try {
      const CosmeticId = req.params.id;
      const name = req.body.name;

      const Cosmetic = await Cosmetic.findById(CosmeticId);
      if (!Cosmetic) {
        return res.status(404).json({ message: "Cosmetic not found" });
      }
      if (name) Cosmetic.name = name;

      await Cosmetic.save();
      return res.status(200).json({
        message: `Cosmetic updated successfully: ${Cosmetic.name}.`,
        data: Cosmetic,
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
