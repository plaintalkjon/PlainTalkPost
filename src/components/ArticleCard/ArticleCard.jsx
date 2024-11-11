import React from "react";
import "./ArticleCard.css";

const ArticleCard = ({
  article,
  userLikes = [],
  userSources = [],
  userBumps = [],
}) => {
  const {
    content_id,
    title,
    link,
    description,
    datetime,
    media_type,
    sources,
    category,
    politicalbias,
    publicationtype,
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

  const isFollowingSource = userSources.includes(sources.sources_id);
  const upvoted = userLikes.includes(content_id);
  const bumped = userBumps.includes(content_id);

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
          <h4>{title}</h4>
          <div className="content-video-container">
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
          <button className="tidbits-button-upvote">
            <img
              className={`tidbits-upvote-img ${upvoted ? "clicked" : ""}`}
              src={`/public/img/${
                upvoted ? "up-filled.png" : "up-outline.png"
              }`}
              alt="upvote"
            />
          </button>
        </div>

        <div className="tidbits">
          <button className="tidbits-button-bump">
            <img
              className="tidbits-bump-img"
              src={`/public/img/${
                bumped ? "bumped-filled.svg" : "bumped-outline.svg"
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
            className={`tidbits-follow-img ${
              isFollowingSource ? "clicked" : ""
            }`}
            src={`/public/img/${
              isFollowingSource
                ? "following-source-img.svg"
                : "follow-source-img.svg"
            }`}
            alt={isFollowingSource ? "unfollow source" : "follow source"}
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
