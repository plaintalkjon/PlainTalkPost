import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import UserCard from "../UserCard/UserCard";
import supabase from "../../utility/SupabaseClient";
import "./UserRecommendedFeeds.css";
import Loading from "../Loading/Loading";
import { useUserData } from '../../contexts/UserDataContext';

const UserRecommendedFeeds = ({ profileUserId }) => {
  const { user } = useAuth();
  const { userData, updateUserData } = useUserData();
  const [recommendations, setRecommendations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const isOwnProfile = user?.id === profileUserId;

  useEffect(() => {
    fetchRecommendations();
  }, [profileUserId]);

  const fetchRecommendations = async () => {
    try {
      const { data, error } = await supabase
        .from('user_feed_recommendation')
        .select(`
          feed_id,
          user_profile!user_id (
            username,
            profile_picture
          )
        `)
        .eq('user_id', profileUserId)
        .limit(3);

      if (error) throw error;
      console.log('Recommendations:', data); // For debugging
      setRecommendations(data || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (value.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_profile')
        .select('user_id, username, profile_picture')
        .ilike('username', `%${value}%`)
        .limit(5);

      if (error) throw error;
      
      // Filter out current user and already recommended users
      const filteredResults = data.filter(user => 
        user.user_id !== profileUserId && 
        !recommendations.some(rec => rec.feed_id === user.user_id)
      );
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const addRecommendation = async (recommendedUser) => {
    if (recommendations.length >= 3) return;

    try {
      const { error } = await supabase
        .from('user_feed_recommendation')
        .insert({
          user_id: profileUserId,
          feed_id: recommendedUser.user_id
        });

      if (error) throw error;
      await fetchRecommendations();
      setSearchTerm("");
      setSearchResults([]);
    } catch (error) {
      console.error('Error adding recommendation:', error);
    }
  };

  const removeRecommendation = async (feedId) => {
    try {
      const { error } = await supabase
        .from('user_feed_recommendation')
        .delete()
        .match({ 
          user_id: profileUserId,
          feed_id: feedId 
        });

      if (error) throw error;

      // Update local state to remove the recommendation
      setRecommendations(prevRecs => 
        prevRecs.filter(rec => rec.feed_id !== feedId)
      );
    } catch (error) {
      console.error('Error removing recommendation:', error);
    }
  };

  const handleFollowToggle = async (followUserId) => {
    try {
      const isCurrentlyFollowing = userData.following.includes(followUserId);
      
      // Update the follows table
      const { error } = await supabase
        .from('follows')
        [isCurrentlyFollowing ? 'delete' : 'insert']({
          follower_id: user.id,
          following_id: followUserId
        })
        [isCurrentlyFollowing ? 'match' : 'select']({
          follower_id: user.id,
          following_id: followUserId
        });

      if (error) throw error;

      // Update local state
      updateUserData({
        ...userData,
        following: isCurrentlyFollowing
          ? userData.following.filter(id => id !== followUserId)
          : [...userData.following, followUserId]
      });
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (loading) return <Loading />;

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
        <div className="recommendation-limit">
          {recommendations.length}/3 users recommended
        </div>
      )}

      {isEditing && isOwnProfile && (
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
                  onClick={() => addRecommendation(user)}
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
      )}

      <ul className="feed-list">
        {recommendations.map((rec) => (
          <li key={rec.feed_id} className="feed-item">
            {isEditing && isOwnProfile && (
              <button
                className="remove-button"
                onClick={() => removeRecommendation(rec.feed_id)}
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
