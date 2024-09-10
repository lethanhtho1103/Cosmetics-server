const Contact = require("../models/Contact");

class ContactController {
  async createContact(req, res, next) {
    try {
      const { name, email, phone, content } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Vui lòng nhập tên." });
      }
      if (!email) {
        return res.status(400).json({ message: "Vui lòng nhập email." });
      }
      if (!phone) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập số điện thoại." });
      }
      if (!content) {
        return res.status(400).json({ message: "Vui lòng nhập nội dung." });
      }
      const newContact = new Contact({ name, email, phone, content });
      await newContact.save();

      return res.status(200).json({
        message:
          "Cảm ơn bạn đã liên hệ với chúng tôi với các ý kiến và câu hỏi của bạn. Chúng tôi sẽ sớm trả lời bạn.",
        data: newContact,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau." });
    }
  }

  async getAllContacts(req, res) {
    try {
      const contacts = await Contact.find();
      return res.status(200).json({ data: contacts });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau." });
    }
  }
}

module.exports = new ContactController();
