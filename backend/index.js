require('dotenv').config();
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");

const app = express();
const port = process.env.PORT || 3000;

// ⭐ REQUIRED: Parse JSON body
app.use(express.json());

// ⭐ CORS FIX
app.use(
  cors({
    origin: [
      "https://assignment-zmau.vercel.app",
      "https://assignment-xjm2.onrender.com"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// ⭐ Razorpay setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ⭐ Create order
app.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  console.log("🧾 Received payment amount:", amount);

  if (!amount) {
    return res.status(400).json({ error: "Amount is required" });
  }

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    console.log("🟢 Razorpay order created:", order);
    res.status(200).json(order);
  } catch (err) {
    console.error("🔴 Razorpay error:", err);
    res.status(500).json({ error: "Razorpay order creation failed" });
  }
});
