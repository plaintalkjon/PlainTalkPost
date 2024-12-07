import React, { useState, useMemo } from "react";
import { useInView } from 'react-intersection-observer';
import ContentCard from "@components/ContentCard/ContentCard";
import { useAuth } from "@contexts/AuthContext";
import { useContent, useNewContentCheck } from "@hooks/useContent";
import "./ContentDisplayColumn.css";
import Loading from "@components/Loading/Loading";

const FilterButtons = React.memo(({ user, feedFilter, handleFilterChange }) => (
  <div id="home-column-center-filters">
    {user && (
      <>
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
        <button
          className={`center-column-filter ${
            feedFilter === "yourFollows" ? "activePrimaryFilter" : ""
          }`}
          onClick={() => handleFilterChange("yourFollows")}
          type="button"
        >
          Your Follows
        </button>
      </>
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
));

const ContentDisplayColumn = ({ filters, initialFilter = "yourFeed" }) => {
  const { user, userData } = useAuth();
  const [feedFilter, setFeedFilter] = useState(user ? initialFilter : "");
  const [newestTimestamp, setNewestTimestamp] = useState(null);
  
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

  const allContent = useMemo(() => 
    data?.pages.flatMap(page => page.items) ?? [],
    [data?.pages]
  );

  if (isLoading) {
    return <Loading size="large" />;
  }

  if (isError) {
    return <div>Error loading content</div>;
  }

  return (
    <div id="content-display-column">
      {hasNewContent && (
        <button 
          className="load-new-content-btn"
          onClick={() => {
            setNewestTimestamp(null);
            window.location.reload();
          }}
        >
          Load New Content
        </button>
      )}
      
      <FilterButtons 
        user={user} 
        feedFilter={feedFilter} 
        handleFilterChange={handleFilterChange} 
      />

      {allContent.map((content) => (
        <ContentCard
          key={content.content_id}
          content={content}
          userId={user?.id}
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
