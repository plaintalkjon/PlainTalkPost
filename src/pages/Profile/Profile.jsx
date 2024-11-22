import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile";
import UserRecommendedSources from "../../components/UserRecommendedSources/UserRecommendedSources";
import UserRecommendedFeeds from "../../components/UserRecommendedFeeds/UserRecommendedFeeds";
import UserCommentedContent from '../../components/UserCommentedContent/UserCommentedContent';
import Loading from "../../components/Loading/Loading";
import "./Profile.css";

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  
  const { 
    data: profileData,
    isLoading,
    isError,
    error
  } = useProfile(username);

  if (isLoading) {
    return (
      <div className="profile-loading">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="profile-error">
        <h2>Error loading profile</h2>
        <p>{error.message}</p>
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  const { user_id: profileUserId, profile_picture: profilePicture } = profileData;

  return (
    <div id="profile-body">
      <div className="profile-two-column-layout">
        <div className="profile-left-column">
          <div className="profile-header">
            <div className="profile-picture-container">
              {profilePicture ? (
                <img
                  className="profile-picture"
                  src={`https://plaintalkpostuploads.nyc3.digitaloceanspaces.com/uploads/profile_pictures/${profilePicture}`}
                  alt={`${username}'s Profile Picture`}
                  onError={(e) => {
                    e.target.src = '/img/default-profile.png';
                  }}
                />
              ) : (
                <img
                  className="profile-picture"
                  src="/img/default-profile.png"
                  alt="Default Profile"
                />
              )}
            </div>
            <h1>{username}</h1>
          </div>

          <div className="profile-recommendations">
            <div className="recommended-sources-container">
              <UserRecommendedSources profileUserId={profileUserId} />
            </div>

            <div className="recommended-feeds-container">
              <UserRecommendedFeeds profileUserId={profileUserId} />
            </div>
          </div>
        </div>
        
        <div className="profile-right-column">
          <UserCommentedContent profileUserId={profileUserId} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
