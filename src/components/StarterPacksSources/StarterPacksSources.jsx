import React from "react";
import { useAuth } from "@contexts/AuthContext";
import { useContentOperations } from "@hooks/useContentOperations";
import Loading from "@components/Loading/Loading";
import "./StarterPacksSources.css";

const StarterPacksSources = () => {
  const { user, userData } = useAuth();
  const { followSource } = useContentOperations();

  const starterPacks = [
    {
      id: 1,
      name: "Across The Mainstream",
      description: "A mix of trusted sources across the spectrum!",
      sources: [
        { source_id: 31, name: "CBS News", political_bias: "leanleft" },
        { source_id: 27, name: "NPR", political_bias: "leanleft" },
        { source_id: 34, name: "BBC News", political_bias: "center" },
        { source_id: 1, name: "New York Post", political_bias: "leanright" },
        { source_id: 57, name: "Washington Examiner", political_bias: "right" },
      ]
    },
    {
      id: 2,
      name: "Going Indie",
      description: "Support independent journalism!",
      sources: [
        { source_id: 16, name: "The Intercept", political_bias: "left" },
        { source_id: 77, name: "The Lever", political_bias: "left" },
        { source_id: 3, name: "Reason", political_bias: "leanright" },
        { source_id: 152, name: "The Free Press", political_bias: "leanright" },
        { source_id: 39, name: "Daily Caller", political_bias: "right" },
      ]
    },
    {
        id: 3,
        name: "Video Focused",
        description: "Watch and learn!",
        sources: [
          { source_id: 157, name: "The Majority Report w/ Sam Seder", political_bias: "left" },
          { source_id: 138, name: "Breaking Points", political_bias: "center" },
          { source_id: 150, name: "Glenn Greenwald", political_bias: "center" },
          { source_id: 146, name: "Piers Morgan Uncensored", political_bias: "leanright" },
          { source_id: 139, name: "Ben Shapiro", political_bias: "right" },
        ]
      }
  ];

  const handleFollowSource = (sourceId) => {
    if (!user) return;
    followSource.mutate({ userId: user.id, sourceId });
  };

  return (
    <div className="starter-packs-container">
      <h2>Starter Packs</h2>
      <p className="starter-packs-description">
        Quick-start your feed with these curated collections
      </p>
      
      <div className="starter-packs-grid">
        {starterPacks.map((pack) => {
          
          return (
            <div key={pack.id} className="starter-pack-card">
              <h3>{pack.name}</h3>
              <p>{pack.description}</p>
              <ul className="source-list">
                {pack.sources.map((source) => (
                  <li key={source.source_id} className={`source-item ${source.political_bias}`}>
                    <span className="source-name">{source.name}</span>
                    {user && (
                      <div className="follow-button-container">
                        {followSource.isPending ? (
                          <Loading size="small" />
                        ) : (
                          <img
                            className={`tidbits-follow-img ${userData?.sources?.includes(source.source_id) ? "clicked" : ""}`}
                            src={`/img/${userData?.sources?.includes(source.source_id) 
                              ? "following-source-img.svg" 
                              : "follow-source-img.svg"}`}
                            alt={userData?.sources?.includes(source.source_id) 
                              ? "unfollow source" 
                              : "follow source"}
                            onClick={() => handleFollowSource(source.source_id)}
                          />
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StarterPacksSources;
