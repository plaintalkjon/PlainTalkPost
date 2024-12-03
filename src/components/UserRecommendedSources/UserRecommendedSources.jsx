import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useUserData } from "../../hooks/useUserData";
import { useContentOperations } from "../../hooks/useContentOperations";
import { 
  useSourceRecommendations, 
  useSourceSearch, 
  useRecommendationMutations 
} from "../../hooks/useSourceRecommendations";
import Loading from '../Loading/Loading';
import "./UserRecommendedSources.css";

const UserRecommendedSources = ({ profileUserId }) => {
  const { user } = useAuth();
  const { data: userData } = useUserData(user?.id);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const isOwnProfile = user?.id === profileUserId;

  const { 
    data: recommendations = [], 
    isLoading 
  } = useSourceRecommendations(profileUserId);

  const { 
    data: searchResults = [], 
    isLoading: isSearching 
  } = useSourceSearch(searchTerm, recommendations);

  const { addRecommendation, removeRecommendation } = useRecommendationMutations(profileUserId);
  const { followSource } = useContentOperations();

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleAddRecommendation = (source) => {
    if (recommendations.length >= 3) return;
    addRecommendation.mutate(source, {
      onSuccess: () => {
        setSearchTerm("");
      }
    });
  };

  const handleRemoveRecommendation = (sourceId) => {
    removeRecommendation.mutate(sourceId);
  };

  const handleFollowSource = (sourceId) => {
    if (!user) return;
    followSource.mutate({ userId: user.id, sourceId });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="user-recommended">
      <div className="sources-header">
        <h4>Recommended Sources</h4>
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
            {recommendations.length}/3 sources recommended
          </div>
          <div className="source-search">
            <input
              type="text"
              placeholder={recommendations.length >= 3 
                ? "Maximum sources reached" 
                : "Search for sources..."}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={recommendations.length >= 3}
            />
            {isSearching ? (
              <Loading size="small" />
            ) : (
              searchResults.length > 0 && (
                <ul className="search-results">
                  {searchResults.map(source => (
                    <li 
                      key={source.source_id}
                      onClick={() => handleAddRecommendation(source)}
                      className={source.political_bias}
                    >
                      {source.name}
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        </>
      )}

      <ul className="source-list">
        {recommendations.map((rec) => (
          <li key={rec.source_id} className={`source-item ${rec.source.political_bias}`}>
            {isEditing && isOwnProfile && (
              <button
                className="remove-button"
                onClick={() => handleRemoveRecommendation(rec.source_id)}
                disabled={removeRecommendation.isPending}
              >
                ×
              </button>
            )}
            <span className="source-name">{rec.source.name}</span>
            
            {user && (
              <div className="follow-button-container">
                {followSource.isPending ? (
                  <Loading size="small" />
                ) : (
                  <img
                    className={`tidbits-follow-img ${userData?.sources?.includes(rec.source_id) ? "clicked" : ""}`}
                    src={`/img/${userData?.sources?.includes(rec.source_id) 
                      ? "following-source-img.svg" 
                      : "follow-source-img.svg"}`}
                    alt={userData?.sources?.includes(rec.source_id) 
                      ? "unfollow source" 
                      : "follow source"}
                    onClick={() => handleFollowSource(rec.source_id)}
                  />
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      {recommendations.length === 0 && (
        <p className="no-recommendations">
          {isOwnProfile 
            ? "Add up to 3 sources you recommend!" 
            : "No recommended sources yet."}
        </p>
      )}
    </div>
  );
};

export default UserRecommendedSources;