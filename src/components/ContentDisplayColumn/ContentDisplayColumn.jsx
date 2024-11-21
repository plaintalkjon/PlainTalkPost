import React, { useState, useEffect, useRef, useCallback } from "react";
import ContentCard from "../ContentCard/ContentCard";
import { useUserData } from '../../contexts/UserDataContext';
import { fetchContent } from "../../services/contentServices";
import "./ContentDisplayColumn.css";
import Loading from '../Loading/Loading';

const ContentDisplayColumn = ({ filters, initialFilter = "yourFeed", userId }) => {
  const [feedFilter, setFeedFilter] = useState(userId ? initialFilter : "");
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadedContentIds, setLoadedContentIds] = useState([]);
  const [newestTimestamp, setNewestTimestamp] = useState(null);
  const [hasNewContent, setHasNewContent] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isChangingFilter, setIsChangingFilter] = useState(false); // Add this state

  const loadMoreRef = useRef(null);

  const { userData, loading: userDataLoading } = useUserData();

  const fetchFilteredContent = async (append = false, noLoadedContent = false) => {
    if (loading || (!hasMore && append)) return;

    setLoading(true);
    if (!append) setIsChangingFilter(true);

    const options = {
      ...filters,
      sources: feedFilter === "yourFeed" ? userData.sources : [],
      loadedContentIds: noLoadedContent ? [] : loadedContentIds,
    };

    try {
      const results = await fetchContent(options);

      if (results.length === 0) {
        setHasMore(false);
      } else {
        const newContentIds = results.map((content) => content.content_id);
        
        setLoadedContentIds((prevIds) => [...prevIds, ...newContentIds]);
        setContent((prevContent) => {
          if (noLoadedContent) return results;
          
          const filteredResults = results.filter(
            (content) =>
              !prevContent.some(
                (existingContent) =>
                  existingContent.content_id === content.content_id
              )
          );

          if (filteredResults.length === 0 && append) {
            setHasMore(false);
          }

          return append ? [...prevContent, ...filteredResults] : filteredResults;
        });
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setIsChangingFilter(false);
    }
  };

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading) {
        fetchFilteredContent(true);
      }
    },
    [loading]
  );

  useEffect(() => {
    if (loading || (userId && userData.sources.length === 0)) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [handleObserver, loading]);

  useEffect(() => {
    if (userDataLoading) return;
    fetchFilteredContent(false, true);
  }, [feedFilter, filters, userDataLoading]);

  // Check for new content periodically
  const checkForNewContent = async () => {
    if (!newestTimestamp) return;
    
    const options = {
      ...filters,
      sources: feedFilter === "yourFeed" ? userData.sources : [],
      limit: 1,
      newerThan: newestTimestamp,
    };

    try {
      const newer = await fetchContent(options);
      setHasNewContent(newer.length > 0);
    } catch (error) {
      console.error("Error checking for new content:", error);
    }
  };

  // Set up periodic check for new content
  useEffect(() => {
    if (userDataLoading) return;
    
    const interval = setInterval(checkForNewContent, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [userDataLoading, newestTimestamp]);

  // Move the filter change handler to a memoized callback
  const handleFilterChange = useCallback((newFilter) => {
    setFeedFilter(newFilter);
    setHasMore(true);
    setLoadedContentIds([]);
    // Reset scroll position when changing filters
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (userDataLoading) {
    return <Loading size="large" />;
  }

  return (
    <div id="content-display-column">
      {hasNewContent && (
        <button 
          className="load-new-content-btn"
          onClick={() => {
            setNewestTimestamp(null);
            setHasNewContent(false);
            fetchFilteredContent(false, true);
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
      
      {isChangingFilter ? (
        <Loading />
      ) : (
        <>
          {content.map((content) => (
            <ContentCard
              key={content.content_id}
              content={content}
              userId={userId}
            />
          ))}
          {loading && <Loading />}
          {!loading && !hasMore && content.length > 0 && <p>All content available is loaded</p>}
          {!loading && content.length === 0 && <p>No content found</p>}
          {hasMore && <div ref={loadMoreRef} className="load-more-trigger"></div>}
        </>
      )}
    </div>
  );
};

export default ContentDisplayColumn;
