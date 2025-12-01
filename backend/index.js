require('dotenv').config();
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");

const app = express();
const port =  3000;

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://assignment-zmau.vercel.app",
      "https://assignment-xjm2.onrender.com"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// Render fix (MANDATORY)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Razorpay order creation failed" });
  }
});

app.listen(port, () => console.log("Server running on", port));
