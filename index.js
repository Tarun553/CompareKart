import express from "express";
import cors from "cors";
import productRoute from './routes/productRoute.js'
import searchRoute from './routes/searchRoute.js'
import compareRoute from './routes/compareRoute.js'
import flipkartTestRoute from './routes/flipkartTest.js'
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();
connectDB();
const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/product-details", productRoute);
app.use("/api/search", searchRoute)
app.use("/api/compare", compareRoute)
app.use("/api/compare", flipkartTestRoute)
app.get("/health", (req, res) => {
  res.send("Health check!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
