// src/components/UserCard/UserCard.jsx
import React from "react";
import "./UserCard.css";

const UserCard = ({ username, profilePicture, isFollowing, onFollowToggle }) => {
  return (
    <li className="user-card">
      <img
        className="profile-picture"
        src={`https://plaintalkpostuploads.nyc3.digitaloceanspaces.com/uploads/profile_pictures/${profilePicture}`}
        alt={`${username}'s profile`}
      />
      <span>{username}</span>
      <button className="follow-feed-button" onClick={onFollowToggle}>
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    </li>
  );
};

export default UserCard;
