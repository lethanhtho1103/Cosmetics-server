const multer = require("multer");
const Product = require("../models/Product");
const storage = require("../../services/uploadImage");
const Category = require("../models/Category");
const ProductPromotion = require("../models/ProductPromotion");

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
              message: "Thêm sản phẩm thành công.",
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

      const category = await Category.findOne({ name: categoryName });

      if (!category) {
        return res.status(404).json({ message: "Danh mục không tìm thấy" });
      }

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

      // Thiết lập tiêu chí lọc
      const filterCriteria = {
        category_id: category._id,
        price: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) },
      };

      if (Array.isArray(trademark) && trademark.length > 0) {
        filterCriteria.trademark = { $in: trademark };
      }

      // Lấy danh sách sản phẩm
      const products = await Product.find(filterCriteria).sort(sortCriteria);

      // Lấy danh sách các sản phẩm khuyến mãi liên quan
      const productPromotions = await ProductPromotion.find({
        product_id: { $in: products.map((product) => product._id) },
      }).populate("promotion_id");

      // Tạo một đối tượng để dễ dàng truy cập thông tin khuyến mãi theo product_id
      const promotionsMap = {};
      productPromotions.forEach((productPromotion) => {
        promotionsMap[productPromotion.product_id] =
          productPromotion.promotion_id;
      });

      // Kết hợp sản phẩm với khuyến mãi
      const productsWithPromotions = products.map((product) => {
        return {
          ...product.toObject(),
          promotion: promotionsMap[product._id] || null, // Gán khuyến mãi nếu có, nếu không thì null
        };
      });

      return res.status(200).json({ data: productsWithPromotions });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Lỗi hệ thống: " + error.message });
    }
  }

  async getTopSellingProducts(req, res) {
    try {
      const products = await Product.find()
        .sort({ sold_quantity: -1 })
        .limit(20)
        .lean();

      if (!products || products.length === 0) {
        return res
          .status(404)
          .json({ message: "Không có sản phẩm bán chạy", data: [] });
      }

      const productIds = products.map((prod) => prod._id);
      const productPromotions = await ProductPromotion.find({
        product_id: { $in: productIds },
      }).populate("promotion_id");

      const promotionsMap = {};
      productPromotions.forEach((productPromotion) => {
        promotionsMap[productPromotion.product_id] =
          productPromotion.promotion_id;
      });

      const productsWithPromotions = products.map((prod) => ({
        ...prod,
        promotion: promotionsMap[prod._id] || null,
      }));

      // Return the top selling products
      res.status(200).json({ data: productsWithPromotions });
    } catch (error) {
      res.status(500).json({ message: "Lỗi hệ thống: " + error.message });
    }
  }

  async getProductByName(req, res) {
    try {
      const { nameProduct } = req.query;

      let product = await Product.findOne({
        name: nameProduct.trim().replace(/[\n\r]+/g, ""),
      });

      if (!product) {
        product = await Product.find({
          name: { $regex: nameProduct, $options: "i" },
        });

        if (!product || product.length === 0) {
          return res
            .status(404)
            .json({ message: "Sản phẩm không tìm thấy", data: [] });
        }
      }

      const productIds = Array.isArray(product)
        ? product.map((p) => p._id)
        : [product._id];

      const productPromotions = await ProductPromotion.find({
        product_id: { $in: productIds },
      }).populate("promotion_id");

      const promotionsMap = {};
      productPromotions.forEach((productPromotion) => {
        promotionsMap[productPromotion.product_id] =
          productPromotion.promotion_id;
      });

      const productsWithPromotions = Array.isArray(product)
        ? product.map((prod) => ({
            ...prod.toObject(),
            promotion: promotionsMap[prod._id] || null,
          }))
        : {
            ...product.toObject(),
            promotion: promotionsMap[product._id] || null,
          };

      // Return the product(s) found
      res.status(200).json({ data: productsWithPromotions });
    } catch (error) {
      res.status(500).json({ message: "Lỗi hệ thống: " + error.message });
    }
  }

  async getAllProduct(req, res) {
    try {
      let products = await Product.find();
      res.status(200).json({ data: products });
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
