import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Profile.css";
import { fetchUserIdAndProfilePictureByUsername } from "../../services/userServices";
import UserRecommendedSources from "../../components/UserRecommendedSources/UserRecommendedSources";
import UserRecommendedFeeds from "../../components/UserRecommendedFeeds/UserRecommendedFeeds";
import UserCommentedContent from '../../components/UserCommentedContent/UserCommentedContent';
const Profile = () => {
  const { username } = useParams(); // Extract username from route parameters
  const [profilePicture, setProfilePicture] = useState(null); // Initialize state
  const [profileUserId, setProfileUserId] = useState(null); // Store profile user ID

  // Fetch user ID and profile picture
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { user_id, profile_picture } =
          await fetchUserIdAndProfilePictureByUsername(username);
        setProfileUserId(user_id);
        setProfilePicture(profile_picture);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [username]);

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
                />
              ) : (
                <p>Loading profile picture...</p>
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
