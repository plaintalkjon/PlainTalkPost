// src/pages/Home.jsx
import React, { useState } from "react";
import "./Home.css";
import ContentFilters from "@components/ContentFilters/ContentFilters";
import ContentDisplayColumn from "@components/ContentDisplayColumn/ContentDisplayColumn";
import YourFollowedFeeds from "@components/UserFollowedFeeds/UserFollowedFeeds";
import RecommendedFeeds from "@components/SystemRecommendedFeeds/SystemRecommendedFeeds";
import { useAuth } from "@contexts/AuthContext";
import { useUserData } from "@hooks/useUserData";
import Loading from "@components/Loading/Loading";
import { useContentFilters } from "@hooks/useContentFilters";

const Home = () => {
  const { user } = useAuth();
  const { data: userData, isLoading } = useUserData(user?.id);
  const { filters } = useContentFilters();

  const hasFollowedFeeds = userData?.following?.length > 0;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div id="home-columns-container">
      <div id="home-column-left" className="column home-column-left">
        <ContentFilters />
      </div>
      <div id="home-column-center" className="column home-column-center">
        <ContentDisplayColumn
          filters={filters}
          initialFilter={user ? "yourFeed" : ""}
          userId={user?.id || null}
          userData={userData}
        />
      </div>
      <div className="column home-column-right">
        {hasFollowedFeeds && (
          <YourFollowedFeeds />
        )}
        <RecommendedFeeds
          userData={userData}
          userId={user?.id}
        />
      </div>
    </div>
  );
};

export default Home;
