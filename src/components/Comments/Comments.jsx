import React, { useState, useEffect } from 'react';
import { fetchCommentsByContentId } from '../../services/commentServices';
import './Comments.css';

const Comments = ({ contentId, comments, setComments }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        const data = await fetchCommentsByContentId(contentId);
        setComments(data);
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        setLoading(false);
      }
    };
    loadComments();
  }, [contentId]);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffInHours = Math.floor((now - commentDate) / (1000 * 60 * 60));
    const diffInMinutes = Math.floor((now - commentDate) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min. ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hr. ago`;
    } else {
      return commentDate.toLocaleDateString();
    }
  };

  return (
    <>      
      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length > 0 && (
        <div className="comments-section">
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.comment_id} className="comment">
                <div className="comment-header">
                  <img
                    src={`https://plaintalkpostuploads.nyc3.digitaloceanspaces.com/uploads/profile_pictures/${comment.user_profile.profile_picture}`}
                    alt={`${comment.user_profile.username}'s profile`}
                    className="comment-avatar"
                  />
                  <span className="comment-username">{comment.user_profile.username}</span>
                  <span className="comment-date">
                    {formatTimestamp(comment.created_at)}
                  </span>
                </div>
                <p className="comment-text">{comment.comment_text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Comments;