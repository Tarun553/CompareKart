
import axios from 'axios';
import express from 'express'

const router = express.Router()




// Add this test endpoint to your compareRoute.js
router.get("/test-flipkart", async (req, res) => {
    try {
      console.log("Testing Flipkart API...");
      const response = await axios.request({
        method: "GET",
        url: "https://real-time-flipkart-data2.p.rapidapi.com/product-details",
        params: {
          pincode: "110001",
          pid: "MOBH4DQFTQHZAKAF" // iPhone 14 Blue 128GB
        },
        headers: {
          "x-rapidapi-key": "6dff981274msh3e85652d496e71ep1ff66ajsn496e8c4554d8",
          "x-rapidapi-host": "real-time-flipkart-data2.p.rapidapi.com"
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error("Flipkart API Test Error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      res.status(500).json({ 
        error: "Flipkart API Test Failed",
        details: error.response?.data || error.message 
      });
    }
  });


  export default router