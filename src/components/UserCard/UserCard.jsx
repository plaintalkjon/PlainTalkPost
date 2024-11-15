// src/components/UserCard/UserCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./UserCard.css";

const UserCard = ({ 
  username, 
  profilePicture, 
  isFollowing, 
  onFollowToggle 
}) => {
  const navigate = useNavigate(); // Initialize navigate hook

  // Handle card click for navigation
  const handleCardClick = () => {
    navigate(`/profile/${username}`); // Navigate to the profile page
  };

  return (
    <li 
      className="user-card" 
      onClick={handleCardClick} // Attach click handler for navigation
    >
      <img
        className="profile-picture"
        src={`https://plaintalkpostuploads.nyc3.digitaloceanspaces.com/uploads/profile_pictures/${profilePicture}`}
        alt={`${username}'s profile`}
      />
      <span>{username}</span>
      <button
        className="follow-feed-button"
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click event from triggering
          onFollowToggle(); // Call the follow/unfollow toggle function
        }}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    </li>
  );
};

export default UserCard;
