import React, { useState, useEffect } from "react";
import { toggleFollowSource } from "../../services/followServices"; // Import service functions
import { upvoteContent } from "../../services/contentServices";
import { addComment } from "../../services/commentServices"; // Add this import
import "./ContentCard.css";
import Comments from '../Comments/Comments';
import { fetchCommentsByContentId } from '../../services/commentServices';
import { useUserData } from '../../contexts/UserDataContext'; // Add this import
import { useAuth } from '../../contexts/AuthContext'; // Add this

const ContentCard = ({
  content,
  userId,
}) => {
  const { userData, updateUserData } = useUserData();
  const { userProfile } = useAuth();

  const [isFollowing, setIsFollowing] = useState(
    userData.sources.includes(content.source_id)
  );

  const [isUpvoted, setIsUpvoted] = useState(
    userData.upvotes.includes(content.content_id)
  );

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setIsFollowing(userData.sources.includes(content.source_id));
    setIsUpvoted(userData.upvotes.includes(content.content_id));
  }, [userData, content]);

  const {
    content_id,
    title,
    link,
    description,
    datetime,
    media_type,
    source,
    category,
  } = content;

  const companyname = source.name;

  const timeDifference = Math.abs(new Date() - new Date(datetime));
  const timeHTML =
    timeDifference >= 36e5
      ? `${Math.floor(timeDifference / 36e5)} hr. ago`
      : `${Math.floor(timeDifference / 6e4)} min. ago`;

  // Optimistic UI For Following Sources
  const handleFollowClick = async () => {
    if (!userId) {
      console.warn("User not authenticated");
      return;
    }

    setIsFollowing((prev) => !prev); // Optimistically update UI
    
    // Update global user data through context
    updateUserData({
      sources: isFollowing
        ? userData.sources.filter((id) => id !== content.source_id)
        : [...userData.sources, content.source_id],
    });

    try {
      await toggleFollowSource(userId, content.source_id);
    } catch (error) {
      setIsFollowing((prev) => !prev); // Revert state if error
      // Revert the global state if there's an error
      updateUserData({
        sources: userData.sources,
      });
      console.error("Error following/unfollowing source:", error);
    }
  };

  // Optimistic UI For Upvoting Content
  const handleUpvoteClick = async () => {
    if (!userId) {
      console.warn("User not authenticated");
      return;
    }

    setIsUpvoted((prev) => !prev);

    // Update global user data through context
    updateUserData({
      upvotes: isUpvoted
        ? userData.upvotes.filter((id) => id !== content.content_id)
        : [...userData.upvotes, content.content_id],
    });

    try {
      const response = await upvoteContent(userId, content_id);
      console.log(response.message);
    } catch (error) {
      console.error("Error upvoting content:", error);
      setIsUpvoted((prev) => !prev);
      // Revert the global state if there's an error
      updateUserData({
        upvotes: userData.upvotes,
      });
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

  // Load initial comments
  useEffect(() => {
    const loadComments = async () => {
      const data = await fetchCommentsByContentId(content_id);
      setComments(data);
    };
    loadComments();
  }, [content_id]);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !userProfile) return;

    // Create optimistic comment with profile info
    const optimisticComment = {
      comment_id: Date.now(),
      comment_text: newComment.trim(),
      created_at: new Date().toISOString(),
      user_id: userId,
      content_id: content_id,
      user_profile: {
        username: userProfile.username,
        profile_picture: userProfile.profile_picture
      }
    };

    // Update UI immediately
    setComments(prevComments => [...prevComments, optimisticComment]);
    setNewComment('');
    setIsCommentModalOpen(false);

    try {
      // Actually post to server
      await addComment(userId, content_id, newComment.trim());
      // Could refresh comments here if needed for accurate IDs
    } catch (error) {
      console.error('Error submitting comment:', error);
      // Remove optimistic comment on error
      setComments(prevComments => 
        prevComments.filter(comment => comment.comment_id !== optimisticComment.comment_id)
      );
      // Maybe show error message to user
    }
  };

  return (
    <div id={content_id} className={`${source.political_bias} content-card`}>
      {media_type === "Article" ? (
        <>
          <h4>
            <a href={link} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          </h4>
          <p className="content-description">{description}</p>
        </>
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
          <time>{timeHTML}</time>
        </div>

        <div className="tidbits">
          <img
            className="tidbits-follow-img"
            src={`/img/${isFollowing ? "following-source-img.svg" : "follow-source-img.svg"}`}
            alt={isFollowing ? "unfollow source" : "follow source"}
            onClick={handleFollowClick}
          />
          <a className="tidbits-company-name" href={link}>{companyname}</a>
        </div>

        <div className="tidbits">
          <img
            className="tidbits-comment-img"
            src="/img/comment-img.svg"
            alt="add comment"
            onClick={() => userId ? setIsCommentModalOpen(true) : null}
          />
        </div>

        <div className="tidbits">
          <p>{media_type}</p>
        </div>
      </div>

      {/* Pass comments state to Comments component */}
      <Comments 
        contentId={content_id} 
        comments={comments}
        setComments={setComments}
      />

      {/* Comment Modal */}
      {isCommentModalOpen && (
        <div className="modal-overlay">
          <div className="comment-modal">
            <h3>Add a Comment</h3>
            <textarea
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="modal-buttons">
              <button 
                onClick={() => {
                  setIsCommentModalOpen(false);
                  setNewComment(''); // Clear comment when closing
                }}
              >
                Cancel
              </button>
              <button onClick={handleSubmitComment}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCard;
