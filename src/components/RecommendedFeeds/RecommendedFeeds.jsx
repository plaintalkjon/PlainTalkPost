// src/components/RecommendedFeeds.jsx
import React, { useState, useEffect } from 'react';
import { userIdToRecommendedFeeds } from '../../services/userServices.js';
import './RecommendedFeeds.css';

const RecommendedFeeds = ({ userId }) => {
  const [recommendedFeeds, setRecommendedFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedFeeds = async () => {
      setLoading(true);
      const feeds = await userIdToRecommendedFeeds(userId);
      setRecommendedFeeds(feeds);
      setLoading(false);
    };

    fetchRecommendedFeeds();
  }, [userId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="recommended-feeds">
      <h5 className="heading">Recommended Feeds</h5>
      <ul>
        {recommendedFeeds.map((feed, index) => (
          <li className="user-card" key={index}>
            <img className="profile-picture" src={`https://plaintalkpostuploads.nyc3.digitaloceanspaces.com/uploads/profile_pictures/${feed.profile_picture}`} alt={`${feed.username}'s profile`} />
            <span>{feed.username}</span>
            <button className="follow-feed-button">Follow?</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendedFeeds;
