const express = require("express");
const razorpayInstance = require("../config/razorpay.config.js");
const product = require("../models/product.model");
const Payment = require("../models/payment.model.js");
const {
  validatePaymentVerification,
} = require("razorpay/dist/utils/razorpay-utils.js");
const router = express.Router();

router.post("/:productId/order", async (req, res) => {
  const { productId } = req.params;
  const productview = await product.findById(productId);
  if (!productview) {
    return res.status(404).json({ message: "not found" });
  }

  const order = await razorpayInstance.orders.create({
    amount: productview.price.amount * 100,
    currency: productview.price.currency,
    receipt: `receipt_${productId}`,
    notes: {
      productId: productId,
      productTitle: productview.title,
    },
  });

  const paymentView = (
    await Payment.create({
      orderId: order.id,
      product: productview._id,
      amount: order.amount,
      currency: productview.price.currency,
      status: "pending",
    })
  ).toObject();

  return res
    .status(201)
    .json({ ...paymentView, keyId: razorpayInstance.key_id });
});

router.post("/verify", async (req, res) => {

  const { orderId, paymentId, signature } = req.body;

  const paidamount = await Payment.findOne({
    orderId: orderId,
    status: "pending",
  });
  if (!paidamount) {
    return res.status(404).json({ message: "error form this that thom" });
  }

  const isValid = validatePaymentVerification(
    {
      order_id: orderId,
      payment_id: paymentId,
    },
    signature,
    razorpayInstance.key_secret,
  );
  if (!isValid) {
    return res.status(400).json({ message: "Invalid payment verification" });
  }

  await Payment.updateOne(
    { orderId: orderId },
    {
      $set: { status: "completed", paymentId: paymentId, signature: signature },
    },
  );
});

module.exports = router;
