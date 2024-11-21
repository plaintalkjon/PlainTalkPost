import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useUserData } from "../../contexts/UserDataContext";
import { toggleFollowSource } from "../../services/followServices";
import supabase from "../../utility/SupabaseClient";
import "./UserRecommendedSources.css";
import Loading from '../Loading/Loading';

const UserRecommendedSources = ({ profileUserId }) => {
  const { user } = useAuth();
  const { userData, updateUserData } = useUserData();
  const [recommendations, setRecommendations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});
  
  const isOwnProfile = user?.id === profileUserId;

  const handleFollowSource = async (sourceId) => {
    if (!user) {
      console.warn("User not authenticated");
      return;
    }

    // Optimistically update UI through context
    updateUserData({
      sources: userData.sources.includes(sourceId)
        ? userData.sources.filter(id => id !== sourceId)
        : [...userData.sources, sourceId]
    });

    try {
      await toggleFollowSource(user.id, sourceId);
    } catch (error) {
      console.error("Error following/unfollowing source:", error);
      // Revert the update if there's an error
      updateUserData({
        sources: userData.sources
      });
    }
  };

  // Fetch current recommendations
  useEffect(() => {
    fetchRecommendations();
  }, [profileUserId]);

  const fetchRecommendations = async () => {
    try {
      const { data, error } = await supabase
        .from('user_source_recommendation')
        .select(`
          source_id,
          source:source_id (
            name,
            political_bias
          )
        `)
        .eq('user_id', profileUserId)
        .limit(3);

      if (error) throw error;
      setRecommendations(data || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search sources when typing
  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (value.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('source')
        .select('source_id, name, political_bias')
        .ilike('name', `%${value}%`)
        .limit(5);

      if (error) throw error;
      
      // Filter out already recommended sources
      const filteredResults = data.filter(source => 
        !recommendations.some(rec => rec.source_id === source.source_id)
      );
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching sources:', error);
    }
  };

  // Add a recommendation
  const addRecommendation = async (source) => {
    if (recommendations.length >= 3) return;

    try {
      const { error } = await supabase
        .from('user_source_recommendation')
        .insert({
          user_id: profileUserId,
          source_id: source.source_id
        });

      if (error) throw error;

      // Refresh recommendations
      await fetchRecommendations();
      setSearchTerm("");
      setSearchResults([]);
    } catch (error) {
      console.error('Error adding recommendation:', error);
    }
  };

  // Remove a recommendation
  const removeRecommendation = async (sourceId) => {
    try {
      const { error } = await supabase
        .from('user_source_recommendation')
        .delete()
        .eq('user_id', profileUserId)
        .eq('source_id', sourceId);

      if (error) throw error;
      await fetchRecommendations();
    } catch (error) {
      console.error('Error removing recommendation:', error);
    }
  };

  if (loading) return <Loading />;

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
        <div className="recommendation-limit">
          {recommendations.length}/3 sources recommended
        </div>
      )}

      {isEditing && isOwnProfile && (
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
          {searchResults.length > 0 && (
            <ul className="search-results">
              {searchResults.map(source => (
                <li 
                  key={source.id}
                  onClick={() => addRecommendation(source)}
                  className={source.political_bias}
                >
                  {source.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <ul className="source-list">
        {recommendations.map((rec) => (
          <li key={rec.source_id} className="source-item">
            {isEditing && isOwnProfile && (
              <button
                className="remove-button"
                onClick={() => removeRecommendation(rec.source_id)}
              >
                ×
              </button>
            )}
            <span className="source-name">{rec.source.name}</span>
            
            {user && (
              <div className="follow-button-container">
                {loadingStates[rec.source_id] ? (
                  <Loading size="small" />
                ) : (
                  <img
                    className={`tidbits-follow-img ${userData.sources.includes(rec.source_id) ? "clicked" : ""}`}
                    src={`/img/${
                      userData.sources.includes(rec.source_id) 
                        ? "following-source-img.svg" 
                        : "follow-source-img.svg"
                    }`}
                    alt={userData.sources.includes(rec.source_id) ? "unfollow source" : "follow source"}
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