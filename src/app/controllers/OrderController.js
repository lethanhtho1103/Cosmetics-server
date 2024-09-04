const nodemailer = require("nodemailer");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetail");
const Product = require("../models/Product");
const User = require("../models/User");

class OrderController {
  async createOrder(req, res) {
    const { userId, orderFromCart, orderDetails, singleCartItem, isPayment } =
      req.body;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      const { email } = user;
      const paymentStatus = isPayment === "yes" ? "yes" : "no";

      if (orderFromCart) {
        const userCart = await Cart.findOne({ user_id: userId });
        if (!userCart) {
          return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
        }
        if (singleCartItem) {
          const { product_id } = singleCartItem;
          const item = userCart.items.find(
            (item) => item.product_id == product_id
          );

          if (!item) {
            return res
              .status(404)
              .json({ message: "Sản phẩm không có trong giỏ hàng" });
          }

          const quantity = item.quantity;
          const product = await Product.findById(product_id);
          if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
          }
          if (quantity > product.quantity) {
            return res
              .status(400)
              .json({ message: "Không đủ số lượng sản phẩm" });
          }

          const newOrder = new Order({
            user_id: userId,
            status: "pending",
            is_payment: paymentStatus, // Add payment status
          });
          const savedOrder = await newOrder.save();

          const productTotalPrice = product.price * quantity;
          const newOrderDetail = new OrderDetail({
            order_id: savedOrder._id,
            product_id,
            quantity,
            unit_price: product.price,
          });
          await newOrderDetail.save();

          product.quantity -= quantity;
          product.sold_quantity += quantity; // Tăng số lượng đã bán
          await product.save();

          await Cart.updateOne(
            { _id: userCart._id },
            { $pull: { items: { product_id } } }
          );

          savedOrder.total_price = productTotalPrice;
          await savedOrder.save();

          const orderController = new OrderController();
          await orderController.sendConfirmationEmail(email);

          return res
            .status(200)
            .json({ message: "Đặt hàng thành công", data: savedOrder });
        } else {
          for (const item of userCart.items) {
            const { product_id, quantity } = item;
            const product = await Product.findById(product_id);
            if (!product) {
              return res
                .status(404)
                .json({ message: "Không tìm thấy sản phẩm" });
            }
            if (quantity > product.quantity) {
              return res
                .status(400)
                .json({ message: "Không đủ số lượng sản phẩm" });
            }
          }

          const newOrder = new Order({
            user_id: userId,
            status: "pending",
            is_payment: paymentStatus, // Add payment status
          });
          const savedOrder = await newOrder.save();
          let totalPrice = 0;

          for (const item of userCart.items) {
            const { product_id, quantity } = item;
            const product = await Product.findById(product_id);
            const productTotalPrice = product.price * quantity;
            totalPrice += productTotalPrice;

            const newOrderDetail = new OrderDetail({
              order_id: savedOrder._id,
              product_id,
              quantity,
              unit_price: product.price,
            });
            await newOrderDetail.save();

            product.quantity -= quantity;
            product.sold_quantity += quantity; // Tăng số lượng đã bán
            await product.save();

            await Cart.updateOne(
              { _id: userCart._id },
              { $pull: { items: { product_id } } }
            );
          }
          savedOrder.total_price = totalPrice;
          await savedOrder.save();

          // const orderController = new OrderController();
          // await orderController.sendConfirmationEmail(email);

          return res
            .status(200)
            .json({ message: "Đặt hàng thành công", data: savedOrder });
        }
      } else {
        const { product_id, quantity, unit_price } = orderDetails;
        const product = await Product.findById(product_id);

        if (!product) {
          return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        if (quantity > product.quantity) {
          return res
            .status(400)
            .json({ message: "Không đủ số lượng sản phẩm" });
        }

        const newOrder = new Order({
          user_id: userId,
          status: "pending",
          is_payment: paymentStatus, // Add payment status
        });
        const savedOrder = await newOrder.save();
        const productTotalPrice = product.price * quantity;
        const newOrderDetail = new OrderDetail({
          order_id: savedOrder._id,
          product_id,
          quantity,
          unit_price,
        });
        await newOrderDetail.save();
        product.quantity -= quantity;
        product.sold_quantity += quantity;
        await product.save();
        savedOrder.total_price = productTotalPrice;
        await savedOrder.save();
        // const orderController = new OrderController();
        // await orderController.sendConfirmationEmail(email);
        return res
          .status(200)
          .json({ message: "Đặt hàng thành công", data: savedOrder });
      }
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
      const orders = await Order.find({ user_id: userId });
      const ordersWithDetails = [];
      for (const order of orders) {
        const orderDetails = await OrderDetail.find({
          order_id: order._id,
        }).populate("product_id", "name price image"); // Populate thêm thông tin sản phẩm

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

  async getAllOrders(req, res) {
    try {
      // Tìm tất cả các đơn hàng
      const orders = await Order.find();

      const ordersWithDetails = [];

      for (const order of orders) {
        // Tìm tất cả các chi tiết đơn hàng tương ứng với order_id
        const orderDetails = await OrderDetail.find({
          order_id: order._id,
        }).populate("product_id", "name price image"); // Populate thêm thông tin sản phẩm

        // Kết hợp đơn hàng và chi tiết đơn hàng
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
    const allowedStatuses = ["pending", "accepted", "denied"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }

      order.status = status;
      await order.save();

      return res
        .status(200)
        .json({ message: "Cập nhật trạng thái thành công", data: order });
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
