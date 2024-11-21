import React, { useState, useEffect } from "react";
import { fetchUsernameAndProfilePictureByUserId } from "../../services/userServices";
import { useAuth } from "../../contexts/AuthContext";
import { useUserData } from "../../contexts/UserDataContext";
import UserCard from "../UserCard/UserCard";
import "./UserFollowedFeeds.css";

const UserFollowedFeeds = () => {
  const { user } = useAuth();
  const { userData, loading: userDataLoading } = useUserData();
  const [yourFollowedFeeds, setYourFollowedFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || userDataLoading || !userData.following) return;

    const fetchUserFeeds = async () => {
      setLoading(true);

      try {
        // Use following array from userData context
        const feedDetails = await Promise.all(
          userData.following.map(async (feedId) => {
            const userData = await fetchUsernameAndProfilePictureByUserId(feedId);
            return { feed_id: feedId, ...userData };
          })
        );

        setYourFollowedFeeds(feedDetails);
      } catch (error) {
        console.error("Error fetching followed feeds:", error.message);
      }

      setLoading(false);
    };

    fetchUserFeeds();
  }, [user, userData.following, userDataLoading]);

  if (loading || userDataLoading) return <p>Loading...</p>;

  return (
    <div className="user-followed-feeds-container">
      <h5 className="user-followed-feeds-heading">Followed Feeds</h5>
      <ul className="user-followed-feeds-list">
        {yourFollowedFeeds.map((feed) => (
          <UserCard
            key={feed.username + feed.feed_id}
            username={feed.username}
            profilePicture={feed.profile_picture}
            cardType="system"
          />
        ))}
      </ul>
    </div>
  );
};

export default UserFollowedFeeds;
