import express from "express";
import cors from "cors";
import productRoute from "./routes/productRoute.js";
import searchRoute from "./routes/searchRoute.js";
import compareRoute from "./routes/compareRoute.js";
import flipkartTestRoute from "./routes/flipkartTest.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173", // Default React dev server
    "http://127.0.0.1:5173", // Alternative localhost
    // Add your production frontend URL here when deploying
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200, 
};

app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use("/api/product-details", productRoute);
app.use("/api/search", searchRoute);
app.use("/api/compare", compareRoute);
app.use("/api/compare", flipkartTestRoute);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS-enabled for: ${corsOptions.origin.join(", ")}`);
});
