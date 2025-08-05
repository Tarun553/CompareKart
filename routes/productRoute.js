import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Missing search query" });

  try {
    // 1. Amazon Search
    const amazonSearch = await axios.request({
      method: "GET",
      url: "https://real-time-amazon-data.p.rapidapi.com/search",
      params: { query, country: "IN", page: "1" },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com"
      }
    });

    const amazonResults = amazonSearch.data.data.products.slice(0, 3).map(product => ({
      site: "Amazon",
      title: product.product_title,
      price: parseFloat(product.product_price) || 0,
      originalPrice: parseFloat(product.product_original_price?.replace(/[^0-9.]/g, "")) || null,
      url: product.product_url,
      image: product.product_photo,
      brand: product.product_byline?.replace("Brand: ", "") || null,
      rating: parseFloat(product.product_star_rating) || null,
      reviews: product.product_num_ratings || null
    }));

    // 2. Flipkart Search for PID using Flipkart search endpoint
    const flipkartSearch = await axios.request({
      method: "GET",
      url: "https://real-time-flipkart-data2.p.rapidapi.com/search",
      params: {
        query,
        page: "1"
      },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "real-time-flipkart-data2.p.rapidapi.com"
      }
    });

    const flipkartSearchResults = flipkartSearch.data.data.products || [];
    let flipkartResult = null;

    if (flipkartSearchResults.length > 0) {
      const pid = flipkartSearchResults[0].pid;
      const flipkart = await axios.request({
        method: "GET",
        url: "https://real-time-flipkart-data2.p.rapidapi.com/product-details",
        params: {
          pincode: "110001",
          pid
        },
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": "real-time-flipkart-data2.p.rapidapi.com"
        }
      });

      const flipkartData = flipkart.data.data;
      flipkartResult = {
        site: "Flipkart",
        title: flipkartData.title,
        price: flipkartData.specialPrice || flipkartData.price || flipkartData.mrp || 0,
        originalPrice: flipkartData.mrp || null,
        url: flipkartData.url,
        image: null, // API might not return image
        brand: flipkartData.brand || null,
        rating: null,
        reviews: null
      };
    }

    // Combine all and find best deal
    const allResults = flipkartResult ? [...amazonResults, flipkartResult] : [...amazonResults];
    const bestDeal = allResults.reduce((min, curr) => curr.price < min.price ? curr : min, allResults[0]);

    res.json({
      product: query,
      sources: allResults,
      bestDeal
    });

  } catch (err) {
    console.error("Compare error:", err.message || err);
    res.status(500).json({ error: "Failed to compare prices" });
  }
});

export default router;
