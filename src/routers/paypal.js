const express = require("express");
const router = express.Router();

const paypalService = require("../services/paypal");

router.post("/my-server/create-paypal-order", async (req, res) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const cart = req.body;
    const { jsonResponse, httpStatusCode } = await paypalService.createOrder(
      cart
    );
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

router.post("/my-server/capture-paypal-order", async (req, res) => {
  try {
    const { orderID } = req.body;
    const { jsonResponse, httpStatusCode } = await paypalService.captureOrder(
      orderID
    );
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});

module.exports = router;
