// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
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
  const [authResolved, setAuthResolved] = useState(false); // Tracks when auth state is resolved

  useEffect(() => {
    // Set authResolved to true once the user state is determined
    if (user !== null) {
      setAuthResolved(true);
    }
  }, [user]);

  return (
    <div id="home-columns-container">
      <div id="home-column-left" className="column home-column-left">
        <ArticleFilters filters={filters} setFilters={setFilters} />
      </div>
      <div id="home-column-center" className="column home-column-center">
        {authResolved ? (
          <ArticleDisplayColumn
            filters={filters}
            initialFilter={user ? "yourFeed" : ""}
            userId={user?.id || null} // Pass userId or null
            
          />
        ) : (
          <p>Loading articles...</p> // Placeholder while auth state is being resolved
        )}
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
