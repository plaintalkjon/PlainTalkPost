import React from 'react';
import { useComments, formatTimestamp } from '@hooks/useComments';
import Loading from '@components/Loading/Loading';
import './Comments.css';

const Comments = ({ contentId }) => {
  const { 
    data: comments = [], 
    isLoading,
    isError,
    error 
  } = useComments(contentId);

  if (isLoading) {
    return <Loading size="small" />;
  }

  if (isError) {
    return (
      <div className="comments-error">
        Error loading comments: {error.message}
      </div>
    );
  }

  if (comments.length === 0) {
    return null;
  }

  return (
    <div className="comments-section">
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.comment_id} className="comment">
            <div className="comment-header">
              <img
                src={comment.user_profile.profile_picture
                  ? `https://plaintalkpostuploads.nyc3.digitaloceanspaces.com/uploads/profile_pictures/${comment.user_profile.profile_picture}`
                  : '/img/default-profile.png'
                }
                alt={`${comment.user_profile.username}'s profile`}
                className="comment-avatar"
                onError={(e) => {
                  e.target.src = '/img/default-profile.png';
                }}
              />
              <span className="comment-username">
                {comment.user_profile.username}
              </span>
              <span className="comment-date">
                {formatTimestamp(comment.created_at)}
              </span>
            </div>
            <p className="comment-text">{comment.comment_text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;