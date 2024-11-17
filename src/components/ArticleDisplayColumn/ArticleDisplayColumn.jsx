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
  const [feedFilter, setFeedFilter] = useState(initialFilter);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadedContentIds, setLoadedContentIds] = useState([]);
  const [userData, setUserData] = useState({ sources: [], bumps: [], upvotes: [] });
  const [userDataLoaded, setUserDataLoaded] = useState(false); // Tracks if user data is loaded

  const loadMoreRef = useRef(null);

  const fetchUserData = async () => {
    try {
      const sources = await fetchSourcesByUserId(userId);
      const [bumps, upvotes] = await Promise.all([
        fetchBumpsByUserId(userId),
        fetchUpvotesByUserId(userId),
      ]);

      setUserData({ sources, bumps, upvotes });
      setUserDataLoaded(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserDataLoaded(true);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchFilteredArticles = async (append = false, noLoadedArticles = false) => {
    if (loading) return;

    setLoading(true);

    const options = {
      ...filters,
      sources: feedFilter === "yourFeed" ? userData.sources : [],
      loadedContentIds: noLoadedArticles ? [] : loadedContentIds,
    };

    try {
      const results = await fetchArticles(options);

      if (results.length === 0) {
        setLoading(false);
      } else {
        const newContentIds = results.map((article) => article.content_id);
        const filteredResults = noLoadedArticles
          ? results
          : results.filter(
              (article) =>
                !articles.some(
                  (existingArticle) =>
                    existingArticle.content_id === article.content_id
                )
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

  useEffect(() => {
    if (!userDataLoaded) return;

    console.log("Ran on first load");
    setLoadedContentIds([]);
    fetchFilteredArticles(false, true);
  }, [feedFilter, filters, userDataLoaded]);

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
