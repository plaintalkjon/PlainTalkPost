import React, { useState, useEffect } from "react";
import { fetchFeedsByUserId, fetchRecommendedFeedsByUserIdAndFollowedFeeds } from "../../services/userServices.js";
import { toggleFollowFeed } from "../../services/followServices.js";
import { useAuth } from "../../contexts/AuthContext";
import UserCard from "../UserCard/UserCard";
import "./RecommendedFeeds.css";

const RecommendedFeeds = () => {
  const { user } = useAuth();
  const [recommendedFeeds, setRecommendedFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followStates, setFollowStates] = useState({});

  useEffect(() => {
    if (!user) return;

    const fetchRecommendedFeeds = async () => {
      setLoading(true);

      try {
        // Step 1: Get the list of feed_ids the user is already following
        const followedFeedIds = await fetchFeedsByUserId(user.id);

        // Step 2: Fetch recommended feeds (up to 10) excluding followed feeds and the user
        const feedDetails = await fetchRecommendedFeedsByUserIdAndFollowedFeeds(user.id, followedFeedIds);

        // Step 3: Update state with the recommended feeds and initialize follow states
        setRecommendedFeeds(feedDetails);

        const initialFollowStates = {};
        feedDetails.forEach((feed) => {
          initialFollowStates[feed.username] = false; // Initially not followed
        });
        setFollowStates(initialFollowStates);
      } catch (error) {
        console.error("Error fetching recommended feeds:", error.message);
      }

      setLoading(false);
    };

    fetchRecommendedFeeds();
  }, [user]);

  const handleFollowToggle = async (username) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    try {
      await toggleFollowFeed(user.id, username);
      setFollowStates((prevFollowStates) => ({
        ...prevFollowStates,
        [username]: !prevFollowStates[username], // Toggle follow state
      }));
    } catch (error) {
      console.error("Error following feed:", error.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="recommended-feeds">
      <h5 className="heading">Recommended Feeds</h5>
      <ul>
        {recommendedFeeds.map((feed) => (
          <UserCard
            key={feed.feed_id}
            username={feed.username}
            profilePicture={feed.profile_picture}
            isFollowing={followStates[feed.username]}
            onFollowToggle={() => handleFollowToggle(feed.username)}
          />
        ))}
      </ul>
    </div>
  );
};

export default RecommendedFeeds;
