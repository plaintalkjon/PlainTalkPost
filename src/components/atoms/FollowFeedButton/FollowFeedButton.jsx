import React from 'react';
import './FollowFeedButton.css';

const FollowFeedButton = ({ 
  isFollowing, 
  onClick, 
  size = 'medium', // small, medium, large
  disabled = false,
  className = '' 
}) => {
  return (
    <button 
      className={`follow-feed-button ${size} ${isFollowing ? 'following' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowFeedButton;