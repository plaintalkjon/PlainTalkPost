import React, { useState } from "react";
import { useAuth } from "@contexts/AuthContext";
import { useContentOperations } from "@hooks/useContentOperations";
import Comments from "@components/Comments/Comments";
import "./ContentCard.css";

const ContentCard = ({ content }) => {
  const { user, userProfile, userData } = useAuth();
  const { followSource, upvoteContent, addComment } = useContentOperations(
    content.content_id
  );

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showVideo, setShowVideo] = useState(false);

  const isFollowing = userData?.sources?.includes(content.source_id) || false;
  const isUpvoted = userData?.upvotes?.includes(content.content_id) || false;

  const handleFollowClick = () => {
    if (!user) return;
    followSource.mutate({ userId: user.id, sourceId: content.source_id });
  };

  const handleUpvoteClick = () => {
    if (!user) return;
    upvoteContent.mutate({ userId: user.id, contentId: content.content_id });
  };

  const handleSubmitComment = () => {
    if (!newComment.trim() || !userProfile) return;

    addComment.mutate(
      {
        userId: user.id,
        contentId: content.content_id,
        text: newComment.trim(),
        userProfile,
      },
      {
        onSuccess: () => {
          setNewComment("");
          setIsCommentModalOpen(false);
        },
      }
    );
  };

  if (!content) return null;

  return (
    <div className={`content-card ${content.source?.political_bias}`}>
      {/* Article: Opens in new tab */}
      {content.media_type === "Article" && (
        <h3>
          <a 
            href={content.link} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {content.title}
          </a>
        </h3>
      )}

      {/* Video: Toggles video display */}
      {content.media_type === "Video" && (
        <>
          <h3>
            <a 
              onClick={(e) => {
                e.preventDefault();
                setShowVideo(!showVideo);
              }}
              href="#"
            >
              {content.title}
            </a>
          </h3>
          <div className={`content-video-container ${showVideo ? "show" : ""}`}>
            {showVideo && content.link && (
              <iframe
                src={`https://www.youtube.com/embed/${content.link.split('?v=')[1]}`}

                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded video"
              />
            )}
          </div>
        </>
      )}

      {/* Description for articles */}
      {content.media_type === "Article" && (
        <p className="content-description">{content.description}</p>
      )}

      <div className="tidbits-container">
        {/* Upvote button */}
        {user && (
          <div className="tidbits">
            <button
              className="tidbits-button-upvote"
              onClick={handleUpvoteClick}
              disabled={upvoteContent.isPending}
            >
              <img
                src={`/img/${isUpvoted ? "upvoted-img.png" : "upvote-img.png"}`}
                alt={isUpvoted ? "Remove upvote" : "Upvote"}
              />
            </button>
          </div>
        )}

        {/* Comment button */}
        {user && (
          <div className="tidbits">
            <img
              className="tidbits-comment-img"
              src="/img/comment-img.svg"
              alt="Comment"
              onClick={() => setIsCommentModalOpen(!isCommentModalOpen)}
            />
          </div>
        )}

        {/* Source name and follow button */}
        <div className="tidbits">
          {user && (
            <img
              className={`tidbits-follow-img ${isFollowing ? "clicked" : ""}`}
              src={`/img/${
                isFollowing
                  ? "following-source-img.svg"
                  : "follow-source-img.svg"
              }`}
              alt={isFollowing ? "Unfollow source" : "Follow source"}
              onClick={handleFollowClick}
            />
          )}
          <a
            href={`/source/${content.source?.source_id}`}
            className="tidbits-company-name"
          >
            {content.source?.name}
          </a>
        </div>
      </div>

      {isCommentModalOpen && (
        <div className="comment-modal">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
          />
          <div className="modal-buttons">
            <button onClick={() => setIsCommentModalOpen(false)}>Cancel</button>
            <button
              onClick={handleSubmitComment}
              disabled={addComment.isPending}
            >
              {addComment.isPending ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}

      <Comments contentId={content.content_id} />
    </div>
  );
};

export default ContentCard;
