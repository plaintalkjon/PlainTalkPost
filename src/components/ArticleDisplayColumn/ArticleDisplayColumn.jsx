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

  // Sets the initial active filter based on whether there is a user
  useEffect(() => {
    if (user) {
      setFilter("yourFeed");
    } else {
      setFilter("all");
    }
  }, [user]);

  // Handles tracking what each user is following, has bumped, and has upvtoed.

  const [userSources, setUserSources] = useState([]);
  const [userBumps, setUserBumps] = useState([]);
  const [userUpvotes, setUserUpvotes] = useState([]);

  useEffect(() => {
    const fetchUserActions = async () => {
      if (user) {
        const sources = await fetchSourcesByUserId(user.id); // IDs of sources user follows
        const bumps = await fetchBumpsByUserId(user.id); // IDs of articles user bumped
        const upvotes = await fetchUpvotesByUserId(user.id); // IDs of articles user upvoted
        setUserSources(sources);
        setUserBumps(bumps);
        setUserUpvotes(upvotes);
      }
    };
    fetchUserActions();
  }, [user]);

  // Local State Tracking for user Sources, Bumps and Upvote. This helps eliminate repetitive server calls.
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


  

  // Manages the three filter options in the Article Display Column
  useEffect(() => {
    const fetchFilteredArticles = async () => {
      setLoading(true);
      let results;

      if (filter === "yourFeed" && user) {
        results = await fetchArticles({
          ...filters,
          sources: userSources,
          followedBumpedContent: [],
        });
      } else if (filter === "bumped" && user) {
        const followedBumpedContent = await fetchBumpsByUserId(user.id);
        results = await fetchArticles({
          ...filters,
          sources: [],
          bumps: followedBumpedContent,
        });
      } else {
        // Default case for "all" filter
        results = await fetchArticles(filters); // Fetch all articles without user-specific filters
      }
      setArticles(results);
      setLoading(false);
    };

    fetchFilteredArticles();
  }, [filter, filters, user]);

  if (loading) return <p>Loading...</p>;

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
    </div>
  );
};

export default ArticleDisplayColumn;
