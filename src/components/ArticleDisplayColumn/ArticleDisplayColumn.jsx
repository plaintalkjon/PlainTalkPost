import React from 'react';
import ArticleCard from '../ArticleCard/ArticleCard';
import './ArticleDisplayColumn.css';

const ArticleDisplayColumn = ({ articles, loading, userLikes, userSources, userBumps }) => {
  if (loading) return <p>Loading...</p>;

  return (
    <div className="articles-display-column">
      {articles.map(article => (
        <ArticleCard
          key={article.content_id}
          article={article}
          userLikes={userLikes}
          userSources={userSources}
          userBumps={userBumps}
        />
      ))}
    </div>
  );
};

export default ArticleDisplayColumn;
