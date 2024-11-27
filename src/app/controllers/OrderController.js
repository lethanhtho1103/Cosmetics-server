const nodemailer = require("nodemailer");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetail");
const Product = require("../models/Product");
const User = require("../models/User");
const ProductPromotion = require("../models/ProductPromotion");
const Promotion = require("../models/Promotion");

class OrderController {
  async createOrder(req, res) {
    const { userId, products, isPayment, shipping_method, shipping_cost } =
      req.body;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      const paymentStatus = isPayment === "yes" ? "yes" : "no";

      const userCart = await Cart.findOne({ user_id: userId });
      if (!userCart) {
        return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
      }

      let totalPrice = 0;
      const orderItems = [];

      const newOrder = new Order({
        user_id: userId,
        status: "pending",
        is_payment: paymentStatus,
        shipping_method,
        shipping_cost,
      });
      const savedOrder = await newOrder.save();

      for (const { product_id, quantity } of products) {
        const product = await Product.findById(product_id);
        if (!product) {
          return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        if (quantity > product.quantity) {
          return res
            .status(400)
            .json({ message: "Không đủ số lượng sản phẩm" });
        }

        const productPromotion = await ProductPromotion.findOne({ product_id });
        let unitPrice = product.price;

        if (productPromotion) {
          const promotion = await Promotion.findById(
            productPromotion.promotion_id
          );
          if (promotion && promotion.status === "active") {
            if (promotion.discount_type === "percent") {
              const discountAmount =
                (promotion.discount_value / 100) * unitPrice;
              unitPrice = Math.max(0, unitPrice - discountAmount);
            }
          }
        }

        const productTotalPrice = unitPrice * quantity;
        totalPrice += productTotalPrice;

        const newOrderDetail = new OrderDetail({
          order_id: savedOrder._id,
          product_id,
          quantity,
          unit_price: unitPrice,
        });
        await newOrderDetail.save();

        product.quantity -= quantity;
        product.sold_quantity += quantity;
        await product.save();

        orderItems.push({ product_id, quantity });

        await Cart.updateOne(
          { _id: userCart._id },
          { $pull: { items: { product_id } } }
        );
      }

      // Thêm shipping_cost vào tổng giá
      savedOrder.total_price = totalPrice + shipping_cost;
      await savedOrder.save();

      return res
        .status(200)
        .json({ message: "Đặt hàng thành công.", data: savedOrder });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // async sendConfirmationEmail(email) {
  //   const transporter = nodemailer.createTransport({
  //     host: "smtp.gmail.com",
  //     port: 587,
  //     secure: false,
  //     auth: {
  //       user: process.env.GOOGLE_APP_EMAIL,
  //       pass: process.env.GOOGLE_APP_PASSWORD,
  //     },
  //   });

  //   try {
  //     await transporter.sendMail({
  //       from: '"Orange 👻" <foo@example.com>',
  //       to: email,
  //       subject: "Xác nhận đặt hàng thành công ✔",
  //       text: "Cảm ơn bạn đã đặt hàng từ Orange!",
  //       html: "<b>Cảm ơn bạn đã đặt hàng từ Orange!</b>",
  //     });
  //     console.log("Đã gửi email xác nhận thành công.");
  //   } catch (error) {
  //     console.log("Lỗi khi gửi email xác nhận:", error.message);
  //   }
  // }

  // async notifyAdmin(order) {
  //   const adminEmail = "admin@example.com";
  //   const transporter = nodemailer.createTransport({
  //     service: "gmail",
  //     auth: {
  //       user: "your-email@gmail.com",
  //       pass: "your-email-password",
  //     },
  //   });

  //   const mailOptions = {
  //     from: "your-email@gmail.com",
  //     to: adminEmail,
  //     subject: "Thông báo đơn hàng mới",
  //     text: `Một đơn hàng mới đã được đặt.
  //           Trạng thái: ${order.status}
  //           Thời gian tạo: ${order.createdAt}
  //           Tổng giá: ${order.total_price}
  //           ID người dùng: ${order.user_id}
  //           ID đơn hàng: ${order._id}
  //           `,
  //   };

  //   try {
  //     await transporter.sendMail(mailOptions);
  //     console.log("Đã thông báo cho admin về đơn hàng mới");
  //   } catch (error) {
  //     console.error("Lỗi khi gửi email thông báo cho admin:", error);
  //   }
  // }

  async getAllOrdersByUserId(req, res) {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      const orders = await Order.find({ user_id: userId }).sort({
        order_date: -1,
      });

      const ordersWithDetails = [];
      for (const order of orders) {
        const orderDetails = await OrderDetail.find({
          order_id: order._id,
        }).populate("product_id", "name price image");

        const orderWithDetails = {
          ...order._doc,
          orderDetails: orderDetails.map((detail) => ({
            _id: detail._id,
            product_id: detail.product_id._id,
            product_name: detail.product_id.name,
            product_image: detail.product_id.image,
            unit_price: detail.unit_price,
            quantity: detail.quantity,
          })),
        };
        ordersWithDetails.push(orderWithDetails);
      }

      return res.status(200).json({
        message: "Lấy đơn hàng thành công",
        data: ordersWithDetails,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getOrderById(req, res) {
    const orderId = req.params.orderId;
    try {
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Đơn hàng không tồn tại" });
      }

      // Get order details
      const orderDetails = await OrderDetail.find({
        order_id: order._id,
      }).populate("product_id", "name price image");

      // Combine order with its details
      const orderWithDetails = {
        ...order._doc,
        orderDetails: orderDetails.map((detail) => ({
          _id: detail._id,
          product_id: detail.product_id._id,
          product_name: detail.product_id.name,
          product_image: detail.product_id.image,
          unit_price: detail.unit_price,
          quantity: detail.quantity,
        })),
      };

      return res.status(200).json({
        message: "Lấy đơn hàng thành công",
        data: orderWithDetails,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await Order.find()
        .populate("user_id", "username phone")
        .sort({ order_date: -1 });
      const ordersWithDetails = [];
      for (const order of orders) {
        const orderDetails = await OrderDetail.find({
          order_id: order._id,
        }).populate("product_id", "name price image");
        const orderWithDetails = {
          ...order._doc,
          orderDetails: orderDetails.map((detail) => ({
            _id: detail._id,
            product_id: detail.product_id._id,
            product_name: detail.product_id.name,
            product_image: detail.product_id.image,
            unit_price: detail.unit_price,
            quantity: detail.quantity,
          })),
        };

        ordersWithDetails.push(orderWithDetails);
      }

      return res.status(200).json({
        message: "Lấy tất cả đơn hàng thành công",
        data: ordersWithDetails,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateOrderStatus(req, res) {
    const { orderId, status } = req.body;
    const allowedStatuses = ["pending", "shipped", "denied", "delivered"];
  
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }
  
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }
  
      const previousStatus = order.status;
  
      order.status = status;
  
      if (status === "denied" && previousStatus !== "denied") {
        const orderDetails = await OrderDetail.find({ order_id: orderId });
  
        for (let orderDetail of orderDetails) {
          const product = await Product.findById(orderDetail.product_id);
          if (product) {
            product.quantity += orderDetail.quantity;
            await product.save();
          }
        }
      }
  
      await order.save();
  
      return res.status(200).json({ message: "Cập nhật trạng thái thành công", data: order });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  

  async updatePaymentStatus(req, res) {
    const { orderId, is_payment } = req.body;

    if (is_payment !== "yes" && is_payment !== "no") {
      return res
        .status(400)
        .json({ message: "Trạng thái thanh toán không hợp lệ" });
    }

    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }

      order.is_payment = is_payment;
      await order.save();

      return res.status(200).json({
        message: "Cập nhật trạng thái thanh toán thành công",
        data: order,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new OrderController();
