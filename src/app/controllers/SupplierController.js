const Supplier = require("../models/Supplier");

class SupplierController {
  async createSupplier(req, res) {
    try {
      const { name, email, address, phone } = req.body;

      // Kiểm tra xem các trường bắt buộc có đủ không
      if (!name || !email) {
        return res.status(400).json({ error: "Tên và email là bắt buộc" });
      }
      const supplier = new Supplier({
        name,
        email,
        address: address || "",
        phone,
      });

      await supplier.save();
      res.status(201).json(supplier);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllSuppliers(req, res) {
    try {
      const suppliers = await Supplier.find();
      res.status(200).json(suppliers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSupplierById(req, res) {
    try {
      const supplier = await Supplier.findById(req.params.id);
      if (!supplier) {
        return res.status(404).json({ error: "Không tìm thấy nhà cung cấp" });
      }
      res.status(200).json(supplier);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateSupplier(req, res) {
    try {
      const supplier = await Supplier.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!supplier) {
        return res.status(404).json({ error: "Không tìm thấy nhà cung cấp" });
      }
      res.status(200).json(supplier);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteSupplier(req, res) {
    try {
      const supplier = await Supplier.findByIdAndDelete(req.params.id);
      if (!supplier) {
        return res.status(404).json({ error: "Không tìm thấy nhà cung cấp" });
      }
      res.status(200).json({ message: "Xóa nhà cung cấp thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SupplierController();
