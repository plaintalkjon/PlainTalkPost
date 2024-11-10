// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import "./Home.css";
import ArticleFilters from "../../components/ArticleFilters/ArticleFilters.jsx";
import ArticleDisplayColumn from "../../components/ArticleDisplayColumn/ArticleDisplayColumn.jsx";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import YourFollowedFeeds from "../../components/YourFollowedFeeds/YourFollowedFeeds.jsx";
import RecommendedFeeds from "../../components/RecommendedFeeds/RecommendedFeeds.jsx";
import { fetchArticles } from "../../services/articleServices.js";

const Home = () => {
  // State for filters and articles
  const [filters, setFilters] = useState({
    sort: "trending",
    mediaType: "all",
    bias: "all",
    publication: "all",
    category: "all",
  });
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch articles whenever filters change
  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      const fetchedArticles = await fetchArticles(filters);
      setArticles(fetchedArticles);
      setLoading(false);
    };

    getArticles();
  }, [filters]); // Dependency array ensures useEffect runs whenever filters change

  return (
    <div id="home-columns-container">
      <div className="column home-column-left">
        {/* Pass filters and setFilters to allow updating from ArticleFilters */}
        <ArticleFilters filters={filters} setFilters={setFilters} />
      </div>
      <div className="column home-column-center">
        {/* Pass articles and loading state to ArticleDisplayColumn */}
        <ArticleDisplayColumn articles={articles} loading={loading} />
      </div>
      <div className="column home-column-right">
        <SearchBar />
        <YourFollowedFeeds />
        <RecommendedFeeds />
      </div>
    </div>
  );
};

export default Home;
