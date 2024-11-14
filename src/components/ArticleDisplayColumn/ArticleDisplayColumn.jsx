import React, { useState, useEffect } from "react";
import ArticleCard from "../ArticleCard/ArticleCard";
import { useAuth } from "../../contexts/AuthContext";
import {
  fetchBumpsByUserId,
  fetchSourcesByUserId,
  fetchUpvotesByUserId
} from "../../services/userServices";
import { fetchArticles } from "../../services/articleServices";
import "./ArticleDisplayColumn.css";

const ArticleDisplayColumn = ({ filters }) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState(user ? "yourFeed" : "all");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [loadedContentIds, setLoadedContentIds] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(false); // New state to control when fetching starts

  // Set initial active filter based on whether there is a user
  useEffect(() => {
    setFilter(user ? "yourFeed" : "all");
  }, [user]);

  // Track user actions
  const [userSources, setUserSources] = useState([]);
  const [userBumps, setUserBumps] = useState([]);
  const [userUpvotes, setUserUpvotes] = useState([]);

  
// Only a logged in user needs this information. This may be removable later if I refresh the page on login.
  useEffect(() => {
    const fetchUserActions = async () => {
      if (user) {
        const sources = await fetchSourcesByUserId(user.id);
        const bumps = await fetchBumpsByUserId(user.id);
        const upvotes = await fetchUpvotesByUserId(user.id);
        setUserSources(sources);
        setUserBumps(bumps);
        setUserUpvotes(upvotes);
      }
    };
    fetchUserActions();
  }, [user]);

  // Optimistic updates for local state
  const updateUserSources = (sourceId, followed) => {
    setUserSources((prevSources) =>
      followed ? [...prevSources, sourceId] : prevSources.filter((id) => id !== sourceId)
    );
  };

  const updateUserBumps = (contentId, followed) => {
    setUserBumps((prevBumps) =>
      followed ? [...prevBumps, contentId] : prevBumps.filter((id) => id !== contentId)
    );
  };

  const updateUserUpvotes = (contentId, followed) => {
    setUserUpvotes((prevUpvotes) =>
      followed ? [...prevUpvotes, contentId] : prevUpvotes.filter((id) => id !== contentId)
    );
  };

  // Function to fetch filtered articles
  const fetchFilteredArticles = async (append = false) => {
    setLoading(true);
    const options = {
      ...filters,
      sources: filter === "yourFeed" && user ? userSources : [],
      bumps: filter === "bumped" && user ? userBumps : [],
      loadedContentIds,
    };

    const results = await fetchArticles(options);

    if (results.length === 0) {
      setAllLoaded(true);
    } else {
      const newContentIds = results.map((article) => article.content_id);
      setLoadedContentIds((prevIds) => [...prevIds, ...newContentIds]);
      setArticles((prevArticles) =>
        append ? [...prevArticles, ...results] : results
      );
    }
    setLoading(false);
  };

  // Reset articles and loadedContentIds on filter change
  useEffect(() => {
    setLoadedContentIds([]); // Clear loaded IDs
    setAllLoaded(false);
    setArticles([]); // Clear current articles
    setShouldFetch(true); // Indicate fetching should begin after reset
  }, [filter, filters, user]);

  // Trigger fetch after reset completes
  useEffect(() => {
    if (shouldFetch) {
      fetchFilteredArticles();
      setShouldFetch(false); // Reset fetch control
    }
  }, [shouldFetch]); // Only run when shouldFetch changes

  const handleLoadMore = () => {
    if (!loading && !allLoaded) {
      fetchFilteredArticles(true); // Append new results
    }
  };

  return (
    <div className="articles-display-column">
      <div id="home-column-center-filters">
        {user ? (
          <>
            <div
              className={`center-column-filter ${
                filter === "yourFeed" ? "activeUserCard" : ""
              }`}
              onClick={() => setFilter("yourFeed")}
            >
              <p>Your Feed</p>
            </div>
            <div
              className={`center-column-filter ${
                filter === "bumped" ? "activeUserCard" : ""
              }`}
              onClick={() => setFilter("bumped")}
            >
              <p>Bumped</p>
            </div>
            <div
              className={`center-column-filter ${
                filter === "all" ? "activeUserCard" : ""
              }`}
              onClick={() => setFilter("all")}
            >
              <p>Show All</p>
            </div>
          </>
        ) : (
          <div className="center-column-filter-not-logged-in activeUserCard">
            <p>Show All</p>
          </div>
        )}
      </div>
      {articles.map((article) => (
        <ArticleCard
          key={article.content_id}
          article={article}
          userUpvotes={userUpvotes}
          userSources={userSources}
          userBumps={userBumps}
          onFollowChange={updateUserSources}
          onBumpChange={updateUserBumps}
          onUpvoteChange={updateUserUpvotes}
        />
      ))}
      {loading && <p>Loading articles...</p>}
      {allLoaded && <p>All articles loaded</p>}
      {!allLoaded && !loading && (
        <button onClick={handleLoadMore} className="load-more-button">
          Load More
        </button>
      )}
    </div>
  );
};

export default ArticleDisplayColumn;
