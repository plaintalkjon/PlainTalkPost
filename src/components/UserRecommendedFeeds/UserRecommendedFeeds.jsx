import React, { useState } from "react";
import { useAuth } from "@contexts/AuthContext";
import UserCard from "@components/UserCard/UserCard";
import Loading from "@components/Loading/Loading";
import { 
  useRecommendedFeeds, 
  useUserSearch, 
  useRecommendationMutations 
} from "@hooks/useRecommendedFeeds";
import "./UserRecommendedFeeds.css";

const UserRecommendedFeeds = ({ profileUserId }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const isOwnProfile = user?.id === profileUserId;

  // Queries
  const { 
    data: recommendations = [], 
    isLoading 
  } = useRecommendedFeeds(profileUserId);

  const { 
    data: searchResults = [], 
    isLoading: isSearching 
  } = useUserSearch(searchTerm, profileUserId, recommendations);

  // Mutations
  const { addRecommendation, removeRecommendation } = useRecommendationMutations();

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleAddRecommendation = (recommendedUser) => {
    if (recommendations.length >= 3) return;
    
    addRecommendation.mutate(
      { profileUserId, recommendedUser },
      {
        onSuccess: () => {
          setSearchTerm("");
        }
      }
    );
  };

  const handleRemoveRecommendation = (feedId) => {
    removeRecommendation.mutate({ profileUserId, feedId });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="users-recommended">
      <div className="feeds-header">
        <h4>Recommended Users</h4>
        {isOwnProfile && (
          <button 
            className="edit-button"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
        )}
      </div>

      {isEditing && isOwnProfile && (
        <>
          <div className="recommendation-limit">
            {recommendations.length}/3 users recommended
          </div>
          <div className="feed-search">
            <input
              type="text"
              placeholder={recommendations.length >= 3 
                ? "Maximum users reached" 
                : "Search for users..."}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={recommendations.length >= 3}
            />
            {searchResults.length > 0 && (
              <ul className="search-results">
                {searchResults.map(user => (
                  <li 
                    key={user.user_id}
                    onClick={() => handleAddRecommendation(user)}
                    className="user-result"
                  >
                    <img 
                      src={user.profile_picture 
                        ? `https://plaintalkpostuploads.nyc3.digitaloceanspaces.com/uploads/profile_pictures/${user.profile_picture}`
                        : '/default-profile.png'} 
                      alt={`${user.username}'s profile`}
                      className="user-thumbnail"
                    />
                    <span>{user.username}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      <ul className="feed-list">
        {recommendations.map((rec) => (
          <li key={rec.feed_id} className="feed-item">
            {isEditing && isOwnProfile && (
              <button
                className="remove-button"
                onClick={() => handleRemoveRecommendation(rec.feed_id)}
              >
                ×
              </button>
            )}
            <UserCard
              username={rec.user_profile.username}
              profilePicture={rec.user_profile.profile_picture}
              userId={rec.feed_id}
              cardType="recommended"
            />
          </li>
        ))}
      </ul>

      {recommendations.length === 0 && (
        <p className="no-recommendations">
          {isOwnProfile 
            ? "Add up to 3 users you recommend!" 
            : "No recommended users yet."}
        </p>
      )}
    </div>
  );
};

export default UserRecommendedFeeds;
