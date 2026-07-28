import "dotenv/config";
import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  console.error("❌ Razorpay keys are missing in .env");
} else {
  console.log("✅ Razorpay keys loaded");
}

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

// CREATE PAYMENT ORDER
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Razorpay Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;