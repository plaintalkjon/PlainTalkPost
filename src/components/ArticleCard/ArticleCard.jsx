import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext"; // Access authenticated user
import { toggleFollowSource } from "../../services/followServices"; // Import service functions
import { bumpContent, upvoteContent } from "../../services/contentServices";
import "./ArticleCard.css";

const ArticleCard = ({
  article,
  userUpvotes = [], // Add userUpvotes prop
  userSources = [],
  userBumps = [],
  onFollowChange,
  onBumpChange,
  onUpvoteChange,
}) => {
  const { user } = useAuth();

  const [isFollowing, setIsFollowing] = useState(
    userSources.includes(article.sources_id)
  );

  const [isBumped, setIsBumped] = useState(
    userBumps.includes(article.content_id)
  );
  const [isUpvoted, setIsUpvoted] = useState(
    userUpvotes.includes(article.content_id)
  );


  // Update states based on props when they change
  useEffect(() => {
    setIsFollowing(userSources.includes(article.sources_id));
    setIsBumped(userBumps.includes(article.content_id));
    setIsUpvoted(userUpvotes.includes(article.content_id));
  }, [userSources, userBumps, userUpvotes]);

  const {
    content_id,
    title,
    link,
    description,
    datetime,
    media_type,
    sources,
    category,
  } = article;

  const companyname =
    media_type === "Article"
      ? link.includes("www.")
        ? link.split("www.")[1].split("/")[0]
        : link.split("//")[1].split("/")[0]
      : sources.name;

  const timeDifference = Math.abs(new Date() - new Date(datetime));
  const timeHTML =
    timeDifference >= 36e5
      ? `${Math.floor(timeDifference / 36e5)} hr. ago`
      : `${Math.floor(timeDifference / 6e4)} min. ago`;

  // Optimistic UI For Following Sources
  const handleFollowClick = async () => {
    if (!user) {
      console.warn("User not authenticated");
      return;
    }

    setIsFollowing((prev) => !prev); // Optimistically update UI
    onFollowChange(article.sources_id, !isFollowing); // Pass updated follow state to parent

    try {
      await toggleFollowSource(user.id, article.sources_id);
    } catch (error) {
      setIsFollowing((prev) => !prev); // Revert state if error
      onFollowChange(article.sources_id, !isFollowing); // Pass updated follow state to parent
      console.error("Error following/unfollowing source:", error);
    }
  };

  // Optimistic UI For Upvoting Content
  const handleUpvoteClick = async () => {
    if (!user) {
      console.warn("User not authenticated");
      return;
    }

    setIsUpvoted((prev) => !prev);
    onUpvoteChange(article.sources_id, !isUpvoted); // Pass updated follow state to parent

    try {
      const response = await upvoteContent(user.id, content_id);
      console.log(response.message);
    } catch (error) {
      console.error("Error upvoting content:", error);
      // Revert the state if the request fails
      setIsUpvoted((prev) => !prev);
    }
  };

  // Optimistic UI For Bumping Content
  const handleBumpClick = async () => {
    if (!user) {
      console.warn("User not authenticated");
      return;
    }

    // Optimistically update the UI
    setIsBumped((prev) => !prev);
    onBumpChange(article.content_id, !isBumped); // Pass updated follow state to parent

    try {
      const response = await bumpContent(user.id, content_id);
      console.log(response.message);
    } catch (error) {
      console.error("Error bumping content:", error);
      // Revert the state if the request fails
      setIsBumped((prev) => !prev);
      onBumpChange(article.content_id, !isBumped); // Pass updated follow state to parent
    }
  };

  const [showVideo, setShowVideo] = useState(false);

  // Toggle video display
  const toggleVideo = () => {
    setShowVideo((prev) => {
      console.log("Toggling showVideo:", !prev); // Debugging statement
      return !prev;
    });
  };

  return (
    <div id={content_id} className={`${sources.politicalbias} article-card`}>
      {media_type === "Article" ? (
        <h4>
          <a href={link} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        </h4>
      ) : (
        <div>
          <h4 style={{ cursor: "pointer" }} onClick={toggleVideo}>
            {title}
          </h4>
          <div className={`content-video-container ${showVideo ? "show" : ""}`}>
            <iframe
              src={`https://www.youtube.com/embed/${link.split("v=")[1]}`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      <p className="article-description">{description}</p>

      <div className="tidbits-container">
        <div className="tidbits">
          <button className="tidbits-button-upvote" onClick={handleUpvoteClick}>
            <img
              className={`tidbits-upvote-img ${isUpvoted ? "clicked" : ""}`}
              src={`/img/${isUpvoted ? "up-filled.png" : "up-outline.png"}`}
              alt="upvote"
            />
          </button>
        </div>

        <div className="tidbits">
          <button className="tidbits-button-bump" onClick={handleBumpClick}>
            <img
              className={`tidbits-bump-img ${isBumped ? "clicked" : ""}`}
              src={`/img/${
                isBumped ? "bumped-filled.svg" : "bumped-outline.svg"
              }`}
              alt="bump status"
            />
          </button>
        </div>

        <div className="tidbits">
          <time>{timeHTML}</time>
        </div>

        <div className="tidbits">
          <img
            className={`tidbits-follow-img ${isFollowing ? "clicked" : ""}`}
            src={`/img/${
              isFollowing ? "following-source-img.svg" : "follow-source-img.svg"
            }`}
            alt={isFollowing ? "unfollow source" : "follow source"}
            onClick={handleFollowClick}
          />
          <a
            className="tidbits-company-name"
            href={`https://www.${companyname}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {companyname}
          </a>
        </div>

        <div className="tidbits">
          <p>{sources.publicationtype}</p>
        </div>

        <div className="tidbits">
          <p>{media_type}</p>
        </div>

        {category && (
          <div className="tidbits">
            <p>{category}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
