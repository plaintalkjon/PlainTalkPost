import React, { useState, useEffect } from "react";
import { fetchRecommendedFeedsByUserIdAndFollowedFeeds } from "../../services/userServices.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useUserData } from "../../contexts/UserDataContext.jsx";
import UserCard from "../UserCard/UserCard.jsx";
import "./SystemRecommendedFeeds.css";

const RecommendedFeeds = () => {
  const { user } = useAuth();
  const { userData, loading: userDataLoading } = useUserData();
  const [recommendedFeeds, setRecommendedFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedFeeds = async () => {
      if (userDataLoading) return;
      setLoading(true);

      try {
        let feedDetails;
        if (user) {
          // Use following array from userData context
          feedDetails = await fetchRecommendedFeedsByUserIdAndFollowedFeeds(
            user.id, 
            userData.following || []
          );
        } else {
          // For non-logged-in users, get general recommendations
          feedDetails = await fetchRecommendedFeedsByUserIdAndFollowedFeeds(null, []);
        }

        setRecommendedFeeds(feedDetails);
      } catch (error) {
        console.error("Error fetching recommended feeds:", error.message);
      }

      setLoading(false);
    };

    fetchRecommendedFeeds();
  }, [user, userData.following, userDataLoading]);

  if (loading || userDataLoading) return <p>Loading...</p>;

  return (
    <div className="system-recommended-feeds">
      <h5 className="system-feeds-heading">Recommended Feeds</h5>
      <ul className="system-feeds-list">
        {recommendedFeeds.map((feed) => (
          <UserCard
            key={feed.feed_id + feed.username}
            username={feed.username}
            profilePicture={feed.profile_picture}
            userId={feed.feed_id}
            cardType="system"
          />
        ))}
      </ul>
    </div>
  );
};

export default RecommendedFeeds;
