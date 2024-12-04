// src/pages/Home.jsx
import React from "react";
import "./Home.css";
import ContentFilters from "@components/ContentFilters/ContentFilters";
import ContentDisplayColumn from "@components/ContentDisplayColumn/ContentDisplayColumn";
import RecommendedFeeds from "@components/SystemRecommendedFeeds/SystemRecommendedFeeds";
import { useAuth } from "@contexts/AuthContext";
import { useContentFilters } from "@hooks/useContentFilters";
import WhatYouAreMissing from "@components/WhatYouAreMissing/WhatYouAreMissing";
const Home = () => {
  const { user, userData } = useAuth();
  const { filters } = useContentFilters();

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
        {user ? <RecommendedFeeds /> : <WhatYouAreMissing />}
      </div>
    </div>
  );
};

export default Home;
