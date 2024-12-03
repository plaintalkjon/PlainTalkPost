import React, { useState } from "react";
import { useInView } from 'react-intersection-observer';
import ContentCard from "@components/ContentCard/ContentCard";
import { useUserData } from "@contexts/UserDataContext";
import { useContent, useNewContentCheck } from "@hooks/useContent";
import "./ContentDisplayColumn.css";
import Loading from "@components/Loading/Loading";

const ContentDisplayColumn = ({ filters, initialFilter = "yourFeed", userId }) => {
  const [feedFilter, setFeedFilter] = useState(userId ? initialFilter : "");
  const [newestTimestamp, setNewestTimestamp] = useState(null);
  
  const { userData } = useUserData();
  
  const { 
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
  } = useContent({ filters, feedFilter, userData });

  const { data: hasNewContent } = useNewContentCheck({
    filters,
    feedFilter,
    userData,
    newestTimestamp,
  });

  const { ref: loadMoreRef } = useInView({
    threshold: 0,
    rootMargin: '200px',
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    },
  });

  const handleFilterChange = (newFilter) => {
    setFeedFilter(newFilter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return <Loading size="large" />;
  }

  if (isError) {
    return <div>Error loading content</div>;
  }

  const allContent = data?.pages.flatMap(page => page.items) ?? [];

  return (
    <div id="content-display-column">
      {hasNewContent && (
        <button 
          className="load-new-content-btn"
          onClick={() => {
            setNewestTimestamp(null);
            window.location.reload(); // We can improve this later
          }}
        >
          Load New Content
        </button>
      )}
      
      <div id="home-column-center-filters">
        {userId && (
          <button
            className={`center-column-filter ${
              feedFilter === "yourFeed" ? "activePrimaryFilter" : ""
            }`}
            onClick={() => handleFilterChange("yourFeed")}
            type="button"
          >
            <img 
              src="/img/following-source-img.svg" 
              alt="" 
              style={{ width: '20px', marginRight: '4px' }}
            />
            Your Feed
          </button>
        )}
        <button
          className={`center-column-filter ${
            feedFilter === "" ? "activePrimaryFilter" : ""
          }`}
          onClick={() => handleFilterChange("")}
          type="button"
        >
          Show All
        </button>
      </div>

      {allContent.map((content) => (
        <ContentCard
          key={content.content_id}
          content={content}
          userId={userId}
        />
      ))}
      
      {isFetching && <Loading />}
      {!hasNextPage && allContent.length > 0 && 
        <p>All content available is loaded</p>
      }
      {!isFetching && allContent.length === 0 && 
        <p>No content found</p>
      }
      {hasNextPage && <div ref={loadMoreRef} className="load-more-trigger"></div>}
    </div>
  );
};

export default ContentDisplayColumn;
