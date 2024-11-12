// src/pages/Home.jsx
import React, { useState } from "react";
import "./Home.css";
import ArticleFilters from "../../components/ArticleFilters/ArticleFilters.jsx";
import ArticleDisplayColumn from "../../components/ArticleDisplayColumn/ArticleDisplayColumn.jsx";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import YourFollowedFeeds from "../../components/YourFollowedFeeds/YourFollowedFeeds.jsx";
import RecommendedFeeds from "../../components/RecommendedFeeds/RecommendedFeeds.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";

const Home = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    sort: "trending",
    mediaType: null,
    bias: null,
    publication: null,
    category: null,
  });

  return (
    <div id="home-columns-container">
      <div id="home-column-left" className="column home-column-left">
        <ArticleFilters filters={filters} setFilters={setFilters} />
      </div>
      <div id="home-column-center" className="column home-column-center">
        <ArticleDisplayColumn filters={filters} />
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
