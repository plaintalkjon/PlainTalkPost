import React from "react";
import { useAuth } from "@contexts/AuthContext";
import { useFollowedFeeds } from "@hooks/useFollowedFeeds";
import UserCard from "@components/UserCard/UserCard";
import Loading from "@components/Loading/Loading";
import "./UserFollowedFeeds.css";

const UserFollowedFeeds = () => {
  const { user, userData } = useAuth();
  
  const { 
    data: followedFeeds,
    isLoading: feedsLoading,
    isError,
  } = useFollowedFeeds(userData?.following, {
    enabled: !!userData?.following
  });

  if (feedsLoading) return <Loading />;
  
  if (isError) return <p>Error loading followed feeds</p>;
  
  return (
    <div className="user-followed-feeds-container">
      <h5 className="user-followed-feeds-heading">Followed Feeds</h5>
      <ul className="user-followed-feeds-list">
        {followedFeeds.map((feed) => (
          <UserCard
            key={feed.username}
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

export default UserFollowedFeeds;
