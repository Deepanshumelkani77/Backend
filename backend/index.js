require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");

const app = express();
const port =  3000;

// ---------------------------------------------
// 1️⃣ PARSE JSON REQUEST BODY
// ---------------------------------------------
app.use(express.json());

// ---------------------------------------------
// 2️⃣ CORS CONFIG – WORKS FOR RENDER + VERCEL
// ---------------------------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "https://assignment-59sj.vercel.app",
  
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ---------------------------------------------
// 3️⃣ RAZORPAY SETUP
// ---------------------------------------------
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,       // MUST be set in Render
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ---------------------------------------------
// 4️⃣ CREATE ORDER API
// ---------------------------------------------
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // convert ₹ to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    return res.status(200).json(order);

  } catch (err) {
    console.error("Razorpay Error:", err);
    return res.status(500).json({
      error: "Razorpay order creation failed",
      details: err.message
    });
  }
});

// ---------------------------------------------
// 5️⃣ START SERVER
// ---------------------------------------------
app.listen(port, () => {
  console.log("✅ Backend running on port", port);
});
