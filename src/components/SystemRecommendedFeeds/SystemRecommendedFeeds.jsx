import React from "react";
import { useAuth } from "@contexts/AuthContext";
import { useUserData } from "@contexts/UserDataContext";
import { useSystemRecommendations } from "@hooks/useSystemRecommendations";
import UserCard from "@components/UserCard/UserCard";
import Loading from "@components/Loading/Loading";
import "./SystemRecommendedFeeds.css";

const RecommendedFeeds = () => {
  const { user } = useAuth();
  const { userData } = useUserData();
  
  const { 
    data: recommendedFeeds = [], 
    isLoading,
    isError,
  } = useSystemRecommendations(
    user?.id, 
    userData?.following
  );

  if (isLoading) return <Loading />;
  
  if (isError) return (
    <div className="system-recommended-feeds">
      <h5 className="system-feeds-heading">Recommended Feeds</h5>
      <p>Error loading recommendations</p>
    </div>
  );

  if (recommendedFeeds.length === 0) return (
    <div className="system-recommended-feeds">
      <h5 className="system-feeds-heading">Recommended Feeds</h5>
      <p>No recommendations available</p>
    </div>
  );

  return (
    <div className="system-recommended-feeds">
      <h5 className="system-feeds-heading">Recommended Feeds</h5>
      <ul className="system-feeds-list">
        {recommendedFeeds.map((feed) => (
          <UserCard
            key={feed.feed_id + feed.username}
            username={feed.username}
            profilePicture={feed.profile_picture}
            userId={feed.feed_id}
            cardType="system"
          />
        ))}
      </ul>
    </div>
  );
};

export default RecommendedFeeds;
