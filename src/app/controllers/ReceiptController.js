const Receipt = require("../models/Receipt");
const ReceiptDetail = require("../models/ReceiptDetail");

const ReceiptController = {
  async createReceipt(req, res) {
    try {
      const { admin_id, supplier_id, details } = req.body;
      const total_price = details.reduce((sum, detail) => {
        return sum + detail.quantity * detail.import_price;
      }, 0);
      const newReceipt = new Receipt({
        admin_id,
        supplier_id,
        total_price,
      });
      const savedReceipt = await newReceipt.save();
      const receiptDetails = details.map((detail) => ({
        receipt_id: savedReceipt._id,
        product_id: detail.product_id,
        quantity: detail.quantity,
        import_price: detail.import_price,
      }));
      await ReceiptDetail.insertMany(receiptDetails);
      res.status(201).json({
        message: "Phiếu nhập hàng đã được tạo",
        receipt: savedReceipt,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tạo phiếu nhập hàng", error });
    }
  },

  async getReceipts(req, res) {
    try {
      const receipts = await Receipt.find().populate("supplier_id", "name");

      // Lấy chi tiết phiếu nhập hàng
      const receiptsWithDetails = await Promise.all(
        receipts.map(async (receipt) => {
          const details = await ReceiptDetail.find({
            receipt_id: receipt._id,
          }).populate("product_id", "name"); // Populate tên sản phẩm

          return {
            ...receipt._doc,
            details,
          };
        })
      );

      res.status(200).json(receiptsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy phiếu nhập hàng", error });
    }
  },

  async getReceiptById(req, res) {
    try {
      const receipt = await Receipt.findById(req.params.id);
      if (!receipt) {
        return res.status(404).json({ error: "Không tìm thấy phiếu nhập" });
      }

      const details = await ReceiptDetail.find({
        receipt_id: receipt._id,
      }).populate("product_id", "name");

      const receiptWithDetails = {
        ...receipt._doc,
        details,
      };

      res.status(200).json(receiptWithDetails);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getReceiptDetailById(req, res) {
    try {
      const { receiptDetailId } = req.params;

      const receiptDetail = await ReceiptDetail.findById(
        receiptDetailId
      ).populate("product_id", "name");

      if (!receiptDetail) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy chi tiết phiếu nhập" });
      }

      res.status(200).json(receiptDetail);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi lấy chi tiết phiếu nhập", error });
    }
  },

  async updateReceiptDetail(req, res) {
    try {
      const { receiptDetailId, quantity, import_price } = req.body;

      // Cập nhật số lượng và đơn giá trong ReceiptDetail
      const updatedReceiptDetail = await ReceiptDetail.findByIdAndUpdate(
        receiptDetailId,
        { quantity, import_price },
        { new: true }
      );

      if (!updatedReceiptDetail) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy chi tiết phiếu nhập" });
      }

      // Lấy tất cả các chi tiết phiếu nhập của Receipt liên quan để tính lại tổng tiền
      const receiptDetails = await ReceiptDetail.find({
        receipt_id: updatedReceiptDetail.receipt_id,
      });

      const total_price = receiptDetails.reduce(
        (sum, detail) => sum + detail.quantity * detail.import_price,
        0
      );

      // Cập nhật lại total_price trong Receipt
      await Receipt.findByIdAndUpdate(updatedReceiptDetail.receipt_id, {
        total_price,
      });

      res.status(200).json({
        message: "Cập nhật chi tiết phiếu nhập thành công",
        updatedReceiptDetail,
        total_price,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi cập nhật chi tiết phiếu nhập", error });
    }
  },

  async deleteReceiptDetail(req, res) {
    try {
      const receiptDetailId = req.params.receiptDetailId;

      // Xóa chi tiết phiếu nhập
      const deletedReceiptDetail = await ReceiptDetail.findByIdAndDelete(
        receiptDetailId
      );

      if (!deletedReceiptDetail) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy chi tiết phiếu nhập để xóa" });
      }

      // Lấy tất cả các chi tiết phiếu nhập của Receipt liên quan để tính lại tổng tiền
      const receiptDetails = await ReceiptDetail.find({
        receipt_id: deletedReceiptDetail.receipt_id,
      });

      const total_price = receiptDetails.reduce(
        (sum, detail) => sum + detail.quantity * detail.import_price,
        0
      );

      // Cập nhật lại total_price trong Receipt
      await Receipt.findByIdAndUpdate(deletedReceiptDetail.receipt_id, {
        total_price,
      });

      res.status(200).json({
        message: "Xóa chi tiết phiếu nhập thành công",
        total_price,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi xóa chi tiết phiếu nhập", error });
    }
  },
};

module.exports = ReceiptController;
