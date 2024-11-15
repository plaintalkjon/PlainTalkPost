import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Profile.css";
import {
  fetchUserIdAndProfilePictureByUsername,
  fetchBumpsByUserId,
} from "../../services/userServices";
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import { fetchArticles as fetchArticlesService } from "../../services/articleServices";

const Profile = () => {
  const { username } = useParams(); // Extract username from route parameters
  const [profilePicture, setProfilePicture] = useState(null); // Initialize state
  const [profileUserId, setProfileUserId] = useState(null); // Store profile user ID
  const [bumpedContentIds, setBumpedContentIds] = useState([]);
  const [bumpedContent, setBumpedContent] = useState([]);

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

  // Fetch bumped content IDs
  useEffect(() => {
    if (!profileUserId) return; // Wait until profileUserId is available

    const fetchContentIds = async () => {
      try {
        const contentIds = await fetchBumpsByUserId(profileUserId);
        setBumpedContentIds(contentIds);
      } catch (error) {
        console.error("Error fetching content IDs:", error);
      }
    };

    fetchContentIds();
  }, [profileUserId]);

  // Fetch bumped articles
  useEffect(() => {
    if (!bumpedContentIds.length) return; // Wait until bumpedContentIds are available
    console.log(bumpedContentIds);
    const fetchBumpedArticles = async () => {
      const filters = {
        sort: "latest",
        specificContentIds: bumpedContentIds,
        limit: 5
      };

      try {
        const articles = await fetchArticlesService(filters);
        setBumpedContent(articles);
      } catch (error) {
        console.error("Error fetching bumped articles:", error);
      }
    };

    fetchBumpedArticles();
  }, [bumpedContentIds]);

  return (
    <div id="profile-body">
      <h1>{username}'s Profile</h1>
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
        <div className="profile-bumped-articles">
          <h2>Bumped Articles</h2>
          <div>
            {bumpedContent.length ? (
              bumpedContent.map((article) => (
                <ArticleCard key={article.content_id} article={article} />
              ))
            ) : (
              <p>No articles bumped yet.</p>
            )}
          </div>
        </div>
      </div>
      <div id="profile-div-row-second" className="profile-div-row">
        <div id="profile-recommended-sources">
          <h2>Recommended Sources</h2>
          <p>No recommended sources yet.</p>
        </div>
      </div>
      <div id="profile-div-row-third" className="profile-div-row">
        <div id="profile-recommended-profiles">
          <h2>Recommended Profiles</h2>
          <p>No recommended profiles yet.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
