// src/components/UserCard/UserCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useUserData } from "../../contexts/UserDataContext";
import { toggleFollowFeed } from "../../services/followServices";
import "./UserCard.css";

const UserCard = ({
  username,
  profilePicture,
  userId,
  cardType = "default"
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userData, updateUserData } = useUserData();

  const isFollowing = userData?.following?.includes(userId);
  const handleFollowToggle = async (e) => {
    e.stopPropagation();
    if (!user || !userData?.following) return;

    try {
      // Optimistic update with ALL userData properties preserved
      const newFollowing = isFollowing
        ? userData.following.filter(id => id !== userId)
        : [...(userData.following || []), userId];

      updateUserData({
        ...userData,                // Preserve all existing userData
        following: newFollowing     // Update only the following array
      });

      await toggleFollowFeed(user.id, username);
    } catch (error) {
      // Revert on error (preserving all data)
      updateUserData({
        ...userData,                // Preserve all existing userData
        following: userData.following // Revert only the following array
      });
      console.error('Error toggling follow:', error);
    }
  };

  return (
    <div className={`user-card ${cardType}-card`} onClick={() => navigate(`/profile/${username}`)}>
      <div className="user-card-content">
        <img
          className={`${cardType}-profile-picture`}
          src={profilePicture
            ? `https://plaintalkpostuploads.nyc3.digitaloceanspaces.com/uploads/profile_pictures/${profilePicture}`
            : "/img/default-profile.png"
          }
          alt={`${username}'s profile`}
        />
        <p><span>{username}</span></p>
      </div>
      {user && user.id !== userId && (
        <button 
          className="follow-feed-button" 
          onClick={(e) => handleFollowToggle(e)}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
};

export default UserCard;
