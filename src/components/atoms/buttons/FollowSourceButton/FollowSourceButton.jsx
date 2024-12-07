import React, { useState, useEffect } from 'react';
import Loading from '@components/Loading/Loading';
import './FollowSourceButton.css';

const FollowSourceButton = ({ 
  isFollowing, 
  onClick, 
  disabled = false,
  isLoading = false,
  className = '',
  size = 'medium' // small, medium, large
}) => {
  const [localIsFollowing, setLocalIsFollowing] = useState(isFollowing);

  // Sync with prop when it changes (e.g., after API response)
  useEffect(() => {
    setLocalIsFollowing(isFollowing);
  }, [isFollowing]);

  const handleClick = (e) => {
    // Immediately update local state
    setLocalIsFollowing(!localIsFollowing);
    // Then call the parent's onClick
    onClick(e);
  };

  return (
    <button
      className={`follow-source-button ${size} ${localIsFollowing ? 'following' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled || isLoading}
      aria-label={localIsFollowing ? "Unfollow source" : "Follow source"}
    >
      {isLoading ? (
        <Loading size="small" />
      ) : (
        <img
          src={`/img/${localIsFollowing ? "following-source-img.svg" : "follow-source-img.svg"}`}
          alt=""
          role="presentation"
        />
      )}
    </button>
  );
};

export default FollowSourceButton;