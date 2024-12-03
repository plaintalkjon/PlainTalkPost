// src/components/UserCard/UserCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@contexts/AuthContext";
import { useFollow } from "@hooks/useFollow";
import "./UserCard.css";

const UserCard = ({
  username,
  profilePicture,
  userId,
  cardType = "default",
}) => {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const followMutation = useFollow();
  const queryClient = useQueryClient();

  const isFollowing =
    userData?.following?.includes(userId) ||
    (followMutation.variables?.userId === userId &&
      followMutation.isPending);

  const handleFollowToggle = async (e) => {
    e.stopPropagation();
    if (!user) return;

    followMutation.mutate(
      {
        userId: user.id,
        targetUserId: userId,
      },
      {
        onError: (error) => {
          console.error("Failed to toggle follow:", error);
        },
      }
    );
  };

  const getProfilePictureUrl = (picture) => {
    return picture
      ? `https://plaintalkpostuploads.nyc3.digitaloceanspaces.com/uploads/profile_pictures/${picture}`
      : "/img/default-profile.png";
  };

  return (
    <div
      className={`user-card ${cardType}-card`}
      onClick={() => navigate(`/profile/${username}`)}
    >
      <div className="user-card-content">
        <img
          className={`${cardType}-profile-picture`}
          src={getProfilePictureUrl(profilePicture)}
          alt={`${username}'s profile`}
        />
        <p>
          <span>{username}</span>
        </p>
      </div>
      {user && user.id !== userId && (
        <button
          className={`follow-feed-button ${isFollowing ? "following" : ""} ${
            followMutation.isPending ? "loading" : ""
          }`}
          onClick={handleFollowToggle}
          disabled={followMutation.isPending}
        >
          {followMutation.isPending
            ? "..."
            : isFollowing
            ? "Following"
            : "Follow"}
        </button>
      )}
    </div>
  );
};

export default UserCard;
