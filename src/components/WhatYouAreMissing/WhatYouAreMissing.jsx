import React from "react";
import { useNavigate } from 'react-router-dom';
import "./WhatYouAreMissing.css";

const WhatYouAreMissing = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      title: "Personalized Feed",
      description:
        "Follow your favorite news sources and create your own feed.",
      icon: "📃",
    },
    {
      id: 2,
      title: "Join the Discussion",
      description:
        "Comment on articles and connect with like-minded readers.",
      icon: "💬",
    },
    {
      id: 3,
      title: "Upvote the best",
      description:
        "Take control by upvoting the best articles, ensuring quality content rises to the top.",
      icon: "✔️",
    },
  ];

  const handleSignUpClick = () => {
    navigate('/login?mode=signup');
  };

  return (
    <div className="what-you-are-missing">
      <h2>What You're Missing</h2>
      <div className="features-list">
        {features.map((feature) => (
          <div key={feature.id} className="feature-item">
            <span className="feature-icon">{feature.icon}</span>
            <div className="feature-content">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="cta-buttons">
        <button 
          className="sign-up-button"
          onClick={handleSignUpClick}
        >
          Sign Up Now
        </button>
      </div>
    </div>
  );
};

export default WhatYouAreMissing;
