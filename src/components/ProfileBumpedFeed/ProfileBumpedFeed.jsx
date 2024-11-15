import React, { useState, useEffect } from "react";
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import { fetchBumpsByUserId } from "../../services/userServices";
import { fetchArticles as fetchArticlesService } from "../../services/articleServices";

const ProfileBumpedFeed = ({ profileUserId }) => {
  const [bumpedContentIds, setBumpedContentIds] = useState([]);
  const [bumpedContent, setBumpedContent] = useState([]);

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

    const fetchBumpedArticles = async () => {
      const filters = {
        sort: "latest",
        specificContentIds: bumpedContentIds,
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
  );
};

export default ProfileBumpedFeed;
