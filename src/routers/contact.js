const express = require("express");
const router = express.Router();

const contactController = require("../app/controllers/ContactController");

router.post("/", contactController.createContact);
router.get("/", contactController.getAllContacts);

module.exports = router;
