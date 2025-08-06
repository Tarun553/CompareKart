import express from "express";
import axios from "axios";

const router = express.Router();

// Helper function to handle API errors
const handleApiError = (error, service) => {
  console.error(`[${service} API Error]`, {
    message: error.message,
    status: error.response?.status,
    statusText: error.response?.statusText,
    url: error.config?.url,
    params: error.config?.params,
  });
  return [];
};

router.get("/", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Missing search query" });

  try {
    console.log(`[Compare] Starting comparison for query: ${query}`);

    // 1. Amazon Search
    let amazonResults = [];
    try {
      const amazonSearch = await axios.request({
        method: "GET",
        url: "https://real-time-amazon-data.p.rapidapi.com/search",
        params: {
          query,
          country: "IN",
          page: "1",
        },
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com",
        },
        timeout: 10000, // 10 seconds timeout
      });

      amazonResults = (amazonSearch.data?.data?.products || [])
        .slice(0, 3)
        .map((product) => ({
          site: "Amazon",
          title: product.product_title || "No title",
          price:
            parseFloat(
              (product.product_price || "0").replace(/[^0-9.]/g, "")
            ) || 0,
          originalPrice:
            parseFloat(
              (product.product_original_price || "0").replace(/[^0-9.]/g, "")
            ) || null,
          url: product.product_url,
          image: product.product_photo,
          brand: product.product_byline?.replace("Brand: ", "") || null,
          rating: parseFloat(product.product_star_rating) || null,
          reviews: product.product_num_ratings || null,
        }));
      console.log(`[Amazon] Found ${amazonResults.length} products`);
    } catch (error) {
      amazonResults = handleApiError(error, "Amazon");
    }

    // 2. Flipkart Product Details
    let flipkartResults = [];
    try {
      const flipkartResponse = await axios.request({
        method: "GET",
        url: "https://real-time-flipkart-data2.p.rapidapi.com/product-details",
        params: {
          pincode: "110001",
          pid: "MOBH4DQFTQHZAKAF", // iPhone 14 Blue 128GB
        },
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": "real-time-flipkart-data2.p.rapidapi.com",
        },
        timeout: 10000, // 10 seconds timeout
      });

      const flipkartData = flipkartResponse.data?.data;
      if (flipkartData) {
        flipkartResults = [
          {
            site: "Flipkart",
            title: flipkartData.title || "No title",
            price:
              parseFloat(
                flipkartData.specialPrice || flipkartData.price || "0"
              ) || 0,
            originalPrice: parseFloat(flipkartData.mrp || "0") || null,
            url: flipkartData.url || "https://www.flipkart.com",
            image: flipkartData.imageUrl || null,
            brand: flipkartData.brand || null,
            rating: parseFloat(flipkartData.rating) || null,
            reviews: flipkartData.reviewCount || null,
          },
        ];
        console.log("[Flipkart] Found product details");
      }
    } catch (error) {
      flipkartResults = handleApiError(error, "Flipkart");
    }

    // Combine results from all sources
    const allResults = [...amazonResults, ...flipkartResults];

    if (allResults.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No products found",
        query,
      });
    }

    // Find best deal (lowest price)
    const bestDeal = allResults.reduce(
      (min, curr) => (curr.price < min.price ? curr : min),
      allResults[0]
    );

    res.json({
      success: true,
      product: query,
      sources: allResults,
      bestDeal,
      count: allResults.length,
    });
  } catch (error) {
    console.error("[Compare] Unexpected error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to compare prices",
      details: error.message,
    });
  }
});





export default router;
