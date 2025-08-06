import React, { useState } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { Input } from "./ui/input";
import BtnGradient1 from "./mvpblocks/btn-gradient1";
import { useNavigate } from "react-router-dom";
import Axios from "../api/Axios";

const SearchBar = ({ onSearchResults }) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError("Please enter a search term");
      return;
    }
    if (trimmedQuery.length < 3) {
      setError("Search term must be at least 3 characters long");
      return;
    }

    // Navigate to compare page with search query
    navigate(`/compare?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    // Clear error when user starts typing
    if (error) setError(null);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-full max-w-2xl mx-auto"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for products to compare prices..."
            value={query}
            onChange={handleInputChange}
            className={`pl-10 h-12 text-base shadow-card transition-smooth focus:shadow-button ${
              error ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
            disabled={isLoading}
            aria-invalid={!!error}
            aria-describedby={error ? "search-error" : undefined}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {error && (
          <div
            id="search-error"
            className="flex items-center text-red-500 text-sm mt-1"
          >
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}

        <BtnGradient1
          type="submit"
          disabled={isLoading || !query.trim()}
          className="h-12 px-8 bg-gradient-primary hover:opacity-90 shadow-button transition-smooth self-center"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            "Compare Prices"
          )}
        </BtnGradient1>
      </form>
    </div>
  );
};

export default SearchBar;
