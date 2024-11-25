import React from 'react';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" className="home-link">Return to Home</a>
    </div>
  );
}