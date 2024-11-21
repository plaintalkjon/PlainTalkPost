import React from 'react';
import './Loading.css';

const Loading = ({ size = 'medium' }) => {
  return (
    <div className={`loading-container ${size}`}>
      <img src="/img/loading.svg" alt="Loading..." className="loading-spinner" />
    </div>
  );
};

export default Loading;