const multer = require("multer");
const Product = require("../models/Product");
const storage = require("../../services/uploadImage");
const Category = require("../models/Category");

class ProductController {
  async createProduct(req, res, next) {
    const upload = multer({ storage: storage }).single("image");
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ error: "Lỗi khi tải lên tệp: " + err.message });
      } else if (err) {
        return res.status(500).json({ error: "Lỗi hệ thống: " + err.message });
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
              return res
                .status(400)
                .json({ message: "ID danh mục không hợp lệ" });
            }
          }
          if (existingProduct) {
            existingProduct.quantity += quantity;
            await existingProduct.save();
            return res.json({
              message: "Sản phẩm đã được cập nhật thành công",
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
              message: `Sản phẩm đã được tạo thành công: ${name}.`,
              data: newProduct,
            });
          }
        } catch (error) {
          res.status(500).json({ message: "Lỗi hệ thống: " + error.message });
        }
      }
    });
  }

  async getAllProductsByCategoryName(req, res) {
    try {
      const {
        categoryName,
        sortBy = "name",
        order = "asc",
        minPrice = 0,
        maxPrice = Infinity,
        trademark = [],
      } = req.query;

      // Tìm danh mục theo tên
      const category = await Category.findOne({ name: categoryName });

      if (!category) {
        return res.status(404).json({ message: "Danh mục không tìm thấy" });
      }

      // Xác định tiêu chí sắp xếp
      const sortCriteria = {};
      switch (sortBy) {
        case "name":
          sortCriteria.name = order === "asc" ? 1 : -1;
          break;
        case "price":
          sortCriteria.price = order === "asc" ? 1 : -1;
          break;
        case "average_star":
          sortCriteria.average_star = order === "asc" ? 1 : -1;
          break;
        case "sold_quantity":
          sortCriteria.sold_quantity = order === "asc" ? 1 : -1;
          break;
        default:
          return res
            .status(400)
            .json({ message: "Tiêu chí sắp xếp không hợp lệ" });
      }

      // Tạo đối tượng lọc
      const filterCriteria = {
        category_id: category._id,
        price: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) },
      };

      if (Array.isArray(trademark) && trademark.length > 0) {
        filterCriteria.trademark = { $in: trademark };
      }

      // Tìm và sắp xếp sản phẩm dựa trên tiêu chí
      const products = await Product.find(filterCriteria).sort(sortCriteria);

      return res.status(200).json({ data: products });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Lỗi hệ thống: " + error.message });
    }
  }

  async getProductByName(req, res) {
    try {
      const { nameProduct } = req.query;

      // Check for exact match first
      let product = await Product.findOne({ name: nameProduct });

      // If no exact match, try partial match
      if (!product) {
        product = await Product.find({
          name: { $regex: nameProduct, $options: "i" },
        });

        // If no partial matches, return 404 with an empty array
        if (!product || product.length === 0) {
          return res
            .status(404)
            .json({ message: "Sản phẩm không tìm thấy", data: [] });
        }
      }

      // Return the product(s) found
      res.status(200).json({ data: product });
    } catch (error) {
      res.status(500).json({ message: "Lỗi hệ thống: " + error.message });
    }
  }

  async updateProduct(req, res, next) {
    const upload = multer({ storage: storage }).single("image");
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ error: "Lỗi khi tải lên tệp: " + err.message });
      } else if (err) {
        return res.status(500).json({ error: "Lỗi hệ thống: " + err.message });
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
              return res
                .status(400)
                .json({ message: "ID danh mục không hợp lệ" });
            }
          }
          const product = await Product.findById(productId);
          if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
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
            message: `Sản phẩm đã được cập nhật thành công.`,
            data: product,
          });
        } catch (error) {
          res.status(500).json({ message: "Lỗi hệ thống: " + error.message });
        }
      }
    });
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
      }
      return res.status(200).json({
        message: `Sản phẩm đã được xóa thành công.`,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Lỗi hệ thống: " + error.message });
    }
  }
}

module.exports = new ProductController();
