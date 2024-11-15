import React, { useState, useEffect, useRef, useCallback } from "react";
import ArticleCard from "../ArticleCard/ArticleCard";
import {
  fetchBumpsByUserId,
  fetchSourcesByUserId,
  fetchUpvotesByUserId,
} from "../../services/userServices";
import { fetchArticles } from "../../services/articleServices";
import "./ArticleDisplayColumn.css";

const ArticleDisplayColumn = ({ filters, initialFilter = "yourFeed", userId }) => {
  const [feedFilter, setFeedFilter] = useState(initialFilter); // Sets whether the feedFilter is Your Feed (for logged in users to see their preferred feed) or Show All (for non-logged in users)
  const [articles, setArticles] = useState([]); // These will be the articles that need to be appended
  const [loading, setLoading] = useState(false); // Is loading taking place.
  const [loadedContentIds, setLoadedContentIds] = useState([]); // Tracks what articles are on the page so that infinite scroll doesn't get repeats
  const [userData, setUserData] = useState({
    sources: [],
    bumps: [],
    upvotes: [],
  });

  const loadMoreRef = useRef(null);

  // Fetch user-specific data
  const fetchUserData = async () => {
    try {
      const sources = await fetchSourcesByUserId(userId); // Keep this outside the promise all OR ELSE a bug occurs that loads all articles instead of Your Feed
      const [bumps, upvotes] = await Promise.all([
        fetchBumpsByUserId(userId),
        fetchUpvotesByUserId(userId),
      ]);

      setUserData({ sources, bumps, upvotes });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Initialize user data
  useEffect(() => {
    fetchUserData();
  }, [userId]);

  // Fetch filtered articles, due to async React, Loaded Articles need to be manually done for filter changes or else it will not update the Loaded Articles to an empty array fast enough when changing filters, resulting in the previous searches articles being filtered out.
  const fetchFilteredArticles = async (append = false, noLoadedArticles = false) => {
    if (loading) return; // If loading is occurring, don't get more articles

    setLoading(true);

    const options = {
      ...filters,
      sources: feedFilter === "yourFeed" ? userData.sources : [], // Limit to sources with the search or get everything
      loadedContentIds: noLoadedArticles ? [] : loadedContentIds,
    };

    try {
      const results = await fetchArticles(options);

      if (results.length === 0) {
        loading(false); // Nothing to load so loading is done.
      } else {
        const newContentIds = results.map((article) => article.content_id);

        // Filter out duplicates, which occassionally is a problem with rapid filter changes. Also, you only need to filter IF it's infinite scroll, not when it's a filter change.

        const filteredResults = noLoadedArticles ? results : results.filter(
          (article) =>
            !articles.some((existingArticle) => existingArticle.content_id === article.content_id)
        );
  
        setLoadedContentIds((prevIds) => [...prevIds, ...newContentIds]);
        setArticles((prevArticles) =>
          append ? [...prevArticles, ...filteredResults] : filteredResults
        );
      }

    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading) {
        fetchFilteredArticles(true);
      }
    },
    [loading]
  );

  useEffect(() => {
    if (loading || userData.sources.length === 0) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [handleObserver, loading]);

  // Handle filter changes
  useEffect(() => {
      setLoadedContentIds([]); // Filter change wipes out previous articles, so cleaning up LoadedContentIds since there are no duplicate concerns
      fetchFilteredArticles(false, true);
  }, [feedFilter, filters]);

  console.log(articles);
  return (
    <div className="articles-display-column">
      <div id="home-column-center-filters">
        <div
          className={`center-column-filter ${
            feedFilter === "yourFeed" && !loading ? "activeUserCard" : ""
          }`}
          onClick={() => setFeedFilter("yourFeed")}
        >
          <p>Your Feed</p>
        </div>
        <div
          className={`center-column-filter ${
            feedFilter === "" && !loading ? "activeUserCard" : ""
          }`}
          onClick={() => setFeedFilter("")}
        >
          <p>Show All</p>
        </div>
      </div>
      {articles.map((article) => (
        <ArticleCard
          key={article.content_id}
          feedFilter={feedFilter}
          article={article}
          userUpvotes={userData.upvotes}
          userSources={userData.sources}
          userBumps={userData.bumps}
          userId={userId}
          setUserData={setUserData}
        />
      ))}
      {loading ? <p>Loading articles...</p> : <p>All articles loaded</p>}
      <div ref={loadMoreRef} className="load-more-trigger"></div>
    </div>
  );
};

export default ArticleDisplayColumn;
