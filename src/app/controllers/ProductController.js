const multer = require("multer");
const Product = require("../models/Product");
const storage = require("../../services/uploadImage");
const Category = require("../models/Category");

class ProductController {
  async createProduct(req, res, next) {
    const upload = multer({ storage: storage }).single("image");
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        try {
          const name = req.body.name;
          const description = req.body.description;
          const price = parseInt(req.body.price, 10);
          const quantity = parseInt(req.body.quantity, 10);
          const origin = req.body.origin;
          const trademark = req.body.trademark;
          const expiry = parseInt(req.body.expiry, 10);
          const image = req.file.originalname;
          const category_id = req.body.category_id;

          const existingProduct = await Product.findOne({ name });
          if (category_id) {
            const categoryExists = await Category.findById(category_id);
            if (!categoryExists) {
              return res.status(400).json({ message: "Invalid category_id" });
            }
          }
          if (existingProduct) {
            existingProduct.quantity += quantity;
            await existingProduct.save();
            return res.json({
              message: "Product updated successfully",
              data: existingProduct,
            });
          } else {
            const newProduct = new Product({
              name,
              description,
              price,
              quantity,
              image,
              origin,
              trademark,
              expiry,
              category_id,
            });
            await newProduct.save();
            return res.status(200).json({
              message: `Category created successfully: ${name}.`,
              data: newProduct,
            });
          }
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
    });
  }

  async getAllProducts(req, res) {
    try {
      const query = {};
      const {
        name,
        description,
        specifications,
        cpu_type,
        ram,
        storage,
        display,
        graphics,
        connectivity,
        mouse_keyboard,
        size,
        weight,
        color,
        warranty,
        other_features,
        manufacturer,
        model,
        screenType,
        brightness,
        contrastRatio,
        screenSize,
        panelType,
        viewingAngle,
        responseTime,
        conectivity,
        aspectRatio,
        refreshRate,
        recommendedResolution,
        review,
        mainboard,
        radiators,
        hardDrive,
        card,
        caseTower,
        psu,
        material,
        high,
        mouseType,
        utilities,
        ergonomics,
        requestSystem,
        guarantee,
        keyboardType,
        hearType,
      } = req.query;

      // Xây dựng truy vấn động
      if (name) query.name = new RegExp(name, "i");
      if (description) query.description = new RegExp(description, "i");
      if (specifications)
        query.specifications = new RegExp(specifications, "i");
      if (cpu_type) query.cpu_type = new RegExp(cpu_type, "i");
      if (ram) query.ram = new RegExp(ram, "i");
      if (storage) query.storage = new RegExp(storage, "i");
      if (display) query.display = new RegExp(display, "i");
      if (graphics) query.graphics = new RegExp(graphics, "i");
      if (connectivity) query.connectivity = new RegExp(connectivity, "i");
      if (mouse_keyboard)
        query.mouse_keyboard = new RegExp(mouse_keyboard, "i");
      if (size) query.size = new RegExp(size, "i");
      if (weight) query.weight = new RegExp(weight, "i");
      if (color) query.color = new RegExp(color, "i");
      if (warranty) query.warranty = new RegExp(warranty, "i");
      if (other_features)
        query.other_features = new RegExp(other_features, "i");
      if (manufacturer) query.manufacturer = new RegExp(manufacturer, "i");
      if (model) query.model = new RegExp(model, "i");
      if (screenType) query.screenType = new RegExp(screenType, "i");
      if (brightness) query.brightness = new RegExp(brightness, "i");
      if (contrastRatio) query.contrastRatio = new RegExp(contrastRatio, "i");
      if (screenSize) query.screenSize = new RegExp(screenSize, "i");
      if (panelType) query.panelType = new RegExp(panelType, "i");
      if (viewingAngle) query.viewingAngle = new RegExp(viewingAngle, "i");
      if (responseTime) query.responseTime = new RegExp(responseTime, "i");
      if (conectivity) query.conectivity = new RegExp(conectivity, "i");
      if (aspectRatio) query.aspectRatio = new RegExp(aspectRatio, "i");
      if (refreshRate) query.refreshRate = new RegExp(refreshRate, "i");
      if (recommendedResolution)
        query.recommendedResolution = new RegExp(recommendedResolution, "i");
      if (review) query.review = new RegExp(review, "i");
      if (mainboard) query.mainboard = new RegExp(mainboard, "i");
      if (radiators) query.radiators = new RegExp(radiators, "i");
      if (hardDrive) query.hardDrive = new RegExp(hardDrive, "i");
      if (card) query.card = new RegExp(card, "i");
      if (caseTower) query.caseTower = new RegExp(caseTower, "i");
      if (psu) query.psu = new RegExp(psu, "i");
      if (material) query.material = new RegExp(material, "i");
      if (high) query.high = new RegExp(high, "i");
      if (mouseType) query.mouseType = new RegExp(mouseType, "i");
      if (utilities) query.utilities = new RegExp(utilities, "i");
      if (ergonomics) query.ergonomics = new RegExp(ergonomics, "i");
      if (requestSystem) query.requestSystem = new RegExp(requestSystem, "i");
      if (guarantee) query.guarantee = new RegExp(guarantee, "i");
      if (keyboardType) query.keyboardType = new RegExp(keyboardType, "i");
      if (hearType) query.hearType = new RegExp(hearType, "i");

      // Thực hiện tìm kiếm trong cơ sở dữ liệu
      const products = await Product.find(query).populate("category_id");
      return res.status(200).json({ data: products });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getProductsById(req, res) {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId).populate("category_id");

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ data: product });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateProduct(req, res, next) {
    const upload = multer({ storage: storage }).single("image");
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        try {
          const productId = req.params.id;
          const name = req.body.name;
          const description = req.body.description;
          const price = parseInt(req.body.price, 10);
          const quantity = parseInt(req.body.quantity, 10);
          const origin = req.body.origin;
          const trademark = req.body.trademark;
          const expiry = parseInt(req.body.expiry, 10);
          const category_id = req.body.category_id;
          const image = req.file ? req.file.originalname : undefined;

          if (category_id) {
            const categoryExists = await Category.findById(category_id);
            if (!categoryExists) {
              return res.status(400).json({ message: "Invalid category_id" });
            }
          }
          const product = await Product.findById(productId);
          if (!product) {
            return res.status(404).json({ message: "Product not found" });
          }
          if (name) product.name = name;
          if (description) product.description = description;
          if (price) product.price = price;
          if (quantity) product.quantity = quantity;
          if (category_id) product.category_id = category_id;
          if (image) product.image = image;
          if (origin) product.origin = origin;
          if (trademark) product.trademark = trademark;
          if (expiry) product.expiry = expiry;

          await product.save();
          return res.status(200).json({
            message: `Product updated successfully: ${product.name}.`,
            data: product,
          });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
    });
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json({
        message: `Product deleted successfully: ${deletedProduct.name}.`,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getProductsByCriteria(req, res) {
    try {
      const { sortBy = "sold_quantity", order = "desc" } = req.query;
      const validSortBy = ["sold_quantity", "average_star", "price"];
      if (!validSortBy.includes(sortBy)) {
        return res.status(400).json({ message: "Invalid sortBy value" });
      }
      const validOrder = ["asc", "desc"];
      if (!validOrder.includes(order)) {
        return res.status(400).json({ message: "Invalid order value" });
      }
      const sortOrder = order === "asc" ? 1 : -1;
      const products = await Product.find()
        .sort({ [sortBy]: sortOrder })
        .populate("category_id");
      return res.status(200).json({ data: products });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ProductController();
