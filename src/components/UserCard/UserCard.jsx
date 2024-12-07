// src/components/UserCard/UserCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@contexts/AuthContext";
import { useFollow } from "@hooks/useFollow";
import FollowFeedButton from "@components/atoms/FollowFeedButton/FollowFeedButton";
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

  const isFollowing = userData?.following?.includes(username);

  const handleFollowToggle = async (e) => {
    e.stopPropagation();
    if (!user) return;

    followMutation.mutate(
      {
        userId: user.id,
        username: username,
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
        <FollowFeedButton
          isFollowing={isFollowing}
          onClick={handleFollowToggle}
          disabled={followMutation.isPending}
          size="small"
        />
      )}
    </div>
  );
};

export default UserCard;
