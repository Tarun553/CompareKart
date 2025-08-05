import express from "express";
import axios from "axios";
const router = express.Router();

router.get("/", async (req, res) => {
  const { query } = req.query;

  if (!query) return res.status(400).json({ error: "Missing search query" });

  try {
    const response = await axios.request({
      method: "GET",
      url: "https://real-time-amazon-data.p.rapidapi.com/search",
      params: {
        query,
        country: "IN",
        page: "1"
      },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com"
      }
    });

    const products = response.data.data.products;
    res.json(products);  // sends product titles, prices, ASINs, etc.
  } catch (error) {
    console.error("Search error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
