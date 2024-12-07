import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@contexts/AuthContext";
import { useContentOperations } from "@hooks/useContentOperations";
import Comments from "@components/Comments/Comments";
import "./ContentCard.css";

const ContentCard = React.memo(({ content }) => {
  const { user, userProfile, userData } = useAuth();
  const { followSource, upvoteContent, addComment } = useContentOperations(
    content.content_id
  );

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [localIsFollowing, setLocalIsFollowing] = useState(
    userData?.sources?.includes(content.source_id) || false
  );
  const [localIsUpvoted, setLocalIsUpvoted] = useState(
    userData?.upvotes?.includes(content.content_id) || false
  );
  const [localUpvoteCount, setLocalUpvoteCount] = useState(content.upvotes || 0);

  useEffect(() => {
    setLocalIsFollowing(userData?.sources?.includes(content.source_id) || false);
    setLocalIsUpvoted(userData?.upvotes?.includes(content.content_id) || false);
  }, [userData?.sources, content.source_id, userData?.upvotes, content.content_id]);

  const handleFollowClick = useCallback(() => {
    if (!user) return;
    setLocalIsFollowing(!localIsFollowing);
    followSource.mutate({ userId: user.id, sourceId: content.source_id });
  }, [user, followSource, content.source_id,localIsFollowing]);

  const handleUpvoteClick = useCallback(() => {
    if (!user) return;
    setLocalIsUpvoted(!localIsUpvoted);
    setLocalUpvoteCount(prev => prev + (localIsUpvoted ? -1 : 1));
    upvoteContent.mutate({ userId: user.id, contentId: content.content_id });
  }, [user, upvoteContent, content.content_id, localIsUpvoted]);

  const handleSubmitComment = useCallback(() => {
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
  }, [user, newComment, userProfile, content.content_id, addComment]);

  if (!content) return null;

  const datetime = new Date(content.datetime);
  const now = new Date();
  const timeDifference = now - datetime;
  const minutesAgo = Math.floor(timeDifference / 60000);  

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
                src={`/img/${localIsUpvoted ? "upvoted-img.png" : "upvote-img.png"}`}
                alt={localIsUpvoted ? "Remove upvote" : "Upvote"}
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
            <button
              className="tidbits-button-follow"
              onClick={handleFollowClick}
              disabled={followSource.isPending}
            >
              <img
                src={`/img/${
                  localIsFollowing
                    ? "following-source-img.svg"
                    : "follow-source-img.svg"
                }`}
                alt={localIsFollowing ? "Unfollow source" : "Followsource"}
              />
            </button>
          )}
          <a
            href={`/source/${content.source?.source_id}`}
            className="tidbits-company-name"
          >
            {content.source?.name}
          </a>
        </div>

        {/* Time of article in terms of minutes ago if under an hour, otherwise in terms of hours ago */}
        <div className="tidbits">
          <p>{minutesAgo < 60 ? `${minutesAgo} min` : `${Math.floor(minutesAgo / 60)} hrs`}</p>
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
});

export default React.memo(ContentCard, (prevProps, nextProps) => {
  return (
    prevProps.content.content_id ===nextProps.content.content_id &&
    prevProps.content.upvotes === nextProps.content.upvotes &&
    prevProps.content.comments === nextProps.content.comments
  );
});
