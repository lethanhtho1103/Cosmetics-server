const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

class CartController {
  async addToCart(req, res) {
    try {
      const { userId, productId, quantity } = req.body;

      // Kiểm tra tính hợp lệ của userId và productId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "ID người dùng không hợp lệ" });
      }
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "ID sản phẩm không hợp lệ" });
      }
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ message: "Số lượng không hợp lệ" });
      }

      let cart = await Cart.findOne({ user_id: userId });

      if (!cart) {
        cart = new Cart({ user_id: userId, items: [] });
      }

      const existingItemIndex = cart.items.findIndex(
        (item) => item.product_id.toString() === productId
      );

      if (existingItemIndex !== -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ product_id: productId, quantity });
      }

      await cart.save();
      return res.status(200).json({
        message: "Thêm sản phẩm vào giỏ hàng thành công",
        data: cart,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async addProductsToCart(req, res) {
    try {
      const { userId, products } = req.body;

      // Kiểm tra tính hợp lệ của userId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "ID người dùng không hợp lệ" });
      }

      // Kiểm tra tính hợp lệ của mảng products
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: "Mảng sản phẩm không hợp lệ" });
      }

      for (const product of products) {
        const { productId, quantity } = product;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
          return res
            .status(400)
            .json({ message: `ID sản phẩm không hợp lệ: ${productId}` });
        }
        if (!Number.isInteger(quantity) || quantity <= 0) {
          return res
            .status(400)
            .json({
              message: `Số lượng không hợp lệ cho sản phẩm có ID: ${productId}`,
            });
        }
      }

      let cart = await Cart.findOne({ user_id: userId });

      if (!cart) {
        cart = new Cart({ user_id: userId, items: [] });
      }

      for (const product of products) {
        const { productId, quantity } = product;
        const existingItemIndex = cart.items.findIndex(
          (item) => item.product_id.toString() === productId
        );

        if (existingItemIndex !== -1) {
          cart.items[existingItemIndex].quantity += quantity;
        } else {
          cart.items.push({ product_id: productId, quantity });
        }
      }

      await cart.save();
      return res.status(200).json({
        message: "Thêm các sản phẩm vào giỏ hàng thành công",
        data: cart,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getCart(req, res) {
    try {
      const { userId } = req.params;

      // Kiểm tra tính hợp lệ của userId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "ID người dùng không hợp lệ" });
      }

      const cart = await Cart.findOne({ user_id: userId }).populate(
        "items.product_id"
      );

      if (!cart) {
        return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
      }

      return res.status(200).json({ data: cart });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateCartItem(req, res) {
    try {
      const { userId, productId, quantity } = req.body;

      // Kiểm tra tính hợp lệ của userId và productId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "ID người dùng không hợp lệ" });
      }
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "ID sản phẩm không hợp lệ" });
      }
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ message: "Số lượng không hợp lệ" });
      }

      const cart = await Cart.findOne({ user_id: userId });

      if (!cart) {
        return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.product_id.toString() === productId
      );

      if (itemIndex === -1) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
      }

      cart.items[itemIndex].quantity = quantity;

      await cart.save();
      return res.status(200).json({
        message: "Cập nhật sản phẩm trong giỏ hàng thành công",
        data: cart,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async removeCartItem(req, res) {
    try {
      const { userId, productId } = req.body;

      // Kiểm tra tính hợp lệ của userId và productId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "ID người dùng không hợp lệ" });
      }
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "ID sản phẩm không hợp lệ" });
      }

      const cart = await Cart.findOne({ user_id: userId });

      if (!cart) {
        return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
      }

      cart.items = cart.items.filter(
        (item) => item.product_id.toString() !== productId
      );

      await cart.save();
      return res.status(200).json({
        message: "Xóa sản phẩm khỏi giỏ hàng thành công",
        data: cart,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CartController();
