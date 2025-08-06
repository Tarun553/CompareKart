import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import Axios from "../api/Axios";

const CompareResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [compareData, setCompareData] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("q");

    if (!searchQuery) {
      setError("No search query provided");
      setIsLoading(false);
      return;
    }

    setQuery(searchQuery);
    fetchCompareData(searchQuery);
  }, [location]);

  const fetchCompareData = async (searchQuery) => {
    try {
      setIsLoading(true);
      // Remove the leading slash since baseURL already includes /api
      const response = await Axios.get("compare", {
        params: { query: searchQuery },
      });

      if (response.data.success === false) {
        throw new Error(
          response.data.error || "Failed to fetch comparison data"
        );
      }

      // Transform the data to match our frontend structure
      const formattedData = [
        {
          site: "Amazon",
          products: response.data.sources
            .filter((item) => item.site === "Amazon")
            .map((item) => ({
              title: item.title,
              price: item.price,
              rating: item.rating,
              url: item.url,
            })),
        },
        {
          site: "Flipkart",
          products: response.data.sources
            .filter((item) => item.site === "Flipkart")
            .map((item) => ({
              title: item.title,
              price: item.price,
              rating: item.rating,
              url: item.url,
            })),
        },
      ];

      setCompareData(formattedData);
      setError(null);
    } catch (error) {
      console.error("Error fetching comparison data:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch comparison data. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-lg">Comparing products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Search
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Comparing products for: <span className="text-primary">{query}</span>
        </h1>

        {compareData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found for your search.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {compareData.map((siteData, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-4 bg-gray-50 border-b">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {siteData.site}
                  </h2>
                </div>
                <div className="p-4">
                  {siteData.products && siteData.products.length > 0 ? (
                    siteData.products.map((product, pIndex) => (
                      <div
                        key={pIndex}
                        className="mb-4 pb-4 border-b last:border-b-0"
                      >
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-lg font-bold text-primary">
                          {product.price || "Price not available"}
                        </p>
                        {product.rating && (
                          <div className="flex items-center mt-1">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span className="text-sm text-gray-600">
                              {product.rating}
                            </span>
                          </div>
                        )}
                        <a
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                        >
                          View on {siteData.site}
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 py-4">
                      No products found on {siteData.site}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareResults;
