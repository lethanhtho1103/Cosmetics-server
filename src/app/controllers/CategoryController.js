const Category = require("../models/Category");
const Cosmetic = require("../models/Cosmetic");
const Product = require("../models/Product");

class CategoryController {
  async createCategory(req, res, next) {
    try {
      const { name, cosmetic_id } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      if (cosmetic_id) {
        const CosmeticExists = await Cosmetic.findById(cosmetic_id);
        if (!CosmeticExists) {
          return res.status(400).json({ message: "Invalid cosmetic_id" });
        }
      }

      const newCategory = new Category({
        name,
        cosmetic_id,
      });

      await newCategory.save();
      return res.status(200).json({
        message: `Category created successfully: ${name}.`,
        data: newCategory,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAllCategories(req, res) {
    try {
      const categories = await Category.find();
      const categoriesWithProducts = await Promise.all(
        categories.map(async (category) => {
          const categories = await Product.find({
            category_id: category._id,
          });
          return {
            ...category._doc,
            categories,
          };
        })
      );

      return res.status(200).json(categoriesWithProducts);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getCategoryById(req, res) {
    try {
      const categoryId = req.params.id;
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      const products = await Product.find({ category_id: category._id });
      const categoryWithProducts = {
        ...category._doc,
        products,
      };

      return res.status(200).json(categoryWithProducts);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateCategory(req, res, next) {
    try {
      const categoryId = req.params.id;
      const name = req.body.name;
      const cosmetic_id = req.body.cosmetic_id;

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      if (cosmetic_id) {
        const CosmeticExists = await Cosmetic.findById(cosmetic_id);
        if (!CosmeticExists) {
          return res.status(400).json({ message: "Invalid cosmetic_id" });
        }
      }
      if (name) category.name = name;
      if (cosmetic_id) category.cosmetic_id = cosmetic_id;

      await category.save();
      return res.status(200).json({
        message: `category updated successfully: ${category.name}.`,
        data: category,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;

      const deletedCategory = await Category.findByIdAndDelete(id);

      if (!deletedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.status(200).json({
        message: `Category deleted successfully: ${deletedCategory.name}.`,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CategoryController();
