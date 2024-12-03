import React from 'react';
import ContentCard from '../ContentCard/ContentCard';
import { useCommentedContent } from "@hooks/useCommentedContent";
import Loading from "@components/Loading/Loading";
import "./UserCommentedContent.css";

const UserCommentedContent = ({ profileUserId }) => {
  const { 
    data: commentedContent = [], 
    isLoading,
    isError,
  } = useCommentedContent(profileUserId);

  if (isLoading) return <Loading />;

  if (isError) return (
    <div className="user-commented-content">
      <h2>Recent Comments</h2>
      <p>Error loading commented content</p>
    </div>
  );

  return (
    <div className="user-commented-content">
      <h2>Recent Comments</h2>
      <div className="commented-content-list">
        {commentedContent.length > 0 ? (
          commentedContent.map((content) => (
            <ContentCard
              key={content.content_id}
              content={content}
              userId={profileUserId}
            />
          ))
        ) : (
          <p>No commented content yet</p>
        )}
      </div>
    </div>
  );
};

export default UserCommentedContent;