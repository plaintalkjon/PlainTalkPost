import React, { useState, useEffect } from "react";
import { fetchFeedsByUserId, fetchUsernameAndProfilePictureByUserId } from "../../services/userServices";
import { toggleFollowFeed } from "../../services/followServices";
import { useAuth } from "../../contexts/AuthContext";
import UserCard from "../UserCard/UserCard";
import "./YourFollowedFeeds.css";

const YourFollowedFeeds = () => {
  const { user } = useAuth();
  const [yourFollowedFeeds, setYourFollowedFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followStates, setFollowStates] = useState({});

  useEffect(() => {
    if (!user) return;

    const fetchUserFeeds = async () => {
      setLoading(true);

      try {
        // Step 1: Fetch feed_ids the user is following
        const feedIds = await fetchFeedsByUserId(user.id);

        // Step 2: Fetch username and profile picture for each feed_id
        const feedDetails = await Promise.all(
          feedIds.map(async (feedId) => {
            const userData = await fetchUsernameAndProfilePictureByUserId(feedId);
            return { feed_id: feedId, ...userData };
          })
        );

        // Step 3: Update state with combined feed data
        setYourFollowedFeeds(feedDetails);

        // Step 4: Initialize follow states for each feed
        const initialFollowStates = {};
        feedDetails.forEach((feed) => {
          initialFollowStates[feed.username] = true;
        });
        setFollowStates(initialFollowStates);

      } catch (error) {
        console.error("Error fetching followed feeds:", error.message);
      }

      setLoading(false);
    };

    fetchUserFeeds();
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
        [username]: !prevFollowStates[username],
      }));
    } catch (error) {
      console.error("Error toggling follow:", error.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="your-followed-feeds">
      <h5 className="heading">Your Followed Feeds</h5>
      <ul>
        {yourFollowedFeeds.map((feed) => (
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

export default YourFollowedFeeds;
