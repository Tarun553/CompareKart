import axios from "axios";

async function searchAmazon(query) {
  const options = {
    method: 'GET',
    url: 'https://real-time-amazon-data.p.rapidapi.com/search',
    params: {
      query: query,  // e.g., "iPhone 13"
      country: 'IN',
      page: '1'
    },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    const products = response.data.data.products;
    console.log(products); // shows a list of products with title, price, ASIN, etc.
    return products;
  } catch (error) {
    console.error(error);
  }
}

searchAmazon("iPhone 13");
