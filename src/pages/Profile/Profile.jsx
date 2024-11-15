import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Profile.css";
import { fetchUserIdAndProfilePictureByUsername } from "../../services/userServices";
import ProfileBumpedFeed from "../../components/ProfileBumpedFeed/ProfileBumpedFeed";

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
      <h1>{username}</h1>
      <div id="profile-div-row-first" className="profile-div-row">
        <div id="profile-profile-picture-div">
          {profilePicture ? (
            <img
              id="profile-profile-picture"
              src={`https://plaintalkpostuploads.nyc3.digitaloceanspaces.com/uploads/profile_pictures/${profilePicture}`}
              alt={`${username}'s Profile Picture`}
            />
          ) : (
            <p>Loading profile picture...</p>
          )}
        </div>
        <div id="profile-recommended-sources">
          <h2>Recommended Sources</h2>
          <p>No recommended sources yet.</p>
        </div>
        <div id="profile-recommended-sources">
          <h2>Recommended Users</h2>
          <p>No recommended sources yet.</p>
        </div>
      </div>
      <div id="profile-div-row-second" className="profile-div-row">
        <ProfileBumpedFeed profileUserId={profileUserId} />
      </div>
    </div>
  );
};

export default Profile;
