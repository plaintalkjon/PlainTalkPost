// src/components/ArticleFilters/ArticleFilters.jsx
import React from 'react';
import './ArticleFilters.css';

const ArticleFilters = ({ filters, setFilters }) => {
  // Helper function to update a filter based on filter name and value
  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  return (
    <div id="filters-container">
      <p id="errorMessage" style={{ color: 'red' }}></p>

      <div id="sort-filter" className="filter-section">
        <h5>Sort By</h5>
        <div className="sorting">
          <button
            onClick={() => handleFilterChange('sort', 'trending')}
            id="sort-filter-trending"
            className={`sorting-link trending ${filters.sort === 'trending' ? 'active' : ''}`}
          >
            Trending
          </button>
          <button
            onClick={() => handleFilterChange('sort', 'latest')}
            id="sort-filter-latest"
            className={`sorting-link latest ${filters.sort === 'latest' ? 'active' : ''}`}
          >
            Latest
          </button>
        </div>
      </div>

      <div id="media-filter" className="filter-section">
        <h5>Media Type</h5>
        <button
          onClick={() => handleFilterChange('mediaType', 'all')}
          id="media-filter-all"
          className={`media-link ${filters.mediaType === 'all' ? 'active' : ''}`}
        >
          All Media
        </button>
        <button
          onClick={() => handleFilterChange('mediaType', 'articles')}
          id="media-filter-articles"
          className={`media-link ${filters.mediaType === 'articles' ? 'active' : ''}`}
        >
          Articles
        </button>
        <button
          onClick={() => handleFilterChange('mediaType', 'videos')}
          id="media-filter-videos"
          className={`media-link ${filters.mediaType === 'videos' ? 'active' : ''}`}
        >
          Videos
        </button>
      </div>

      <div id="bias-filter" className="filter-section">
        <h5>Political Bias</h5>
        <button
          onClick={() => handleFilterChange('bias', 'all')}
          id="bias-filter-all"
          className={`filter-link balanced ${filters.bias === 'all' ? 'active' : ''}`}
        >
          All Bias
        </button>
        <button
          onClick={() => handleFilterChange('bias', 'left')}
          id="bias-filter-left"
          className={`filter-link left ${filters.bias === 'left' ? 'active' : ''}`}
        >
          Left
        </button>
        <button
          onClick={() => handleFilterChange('bias', 'leanLeft')}
          id="bias-filter-leanleft"
          className={`filter-link leanleft ${filters.bias === 'leanLeft' ? 'active' : ''}`}
        >
          Left Lean
        </button>
        <button
          onClick={() => handleFilterChange('bias', 'center')}
          id="bias-filter-center"
          className={`filter-link center ${filters.bias === 'center' ? 'active' : ''}`}
        >
          Center
        </button>
        <button
          onClick={() => handleFilterChange('bias', 'leanRight')}
          id="bias-filter-leanright"
          className={`filter-link leanright ${filters.bias === 'leanRight' ? 'active' : ''}`}
        >
          Right Lean
        </button>
        <button
          onClick={() => handleFilterChange('bias', 'right')}
          id="bias-filter-right"
          className={`filter-link right ${filters.bias === 'right' ? 'active' : ''}`}
        >
          Right
        </button>
      </div>

      <div id="publication-filter" className="filter-section">
        <h5>Publications</h5>
        <button
          onClick={() => handleFilterChange('publication', 'all')}
          id="publication-filter-all"
          className={`publications-link all ${filters.publication === 'all' ? 'active' : ''}`}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange('publication', 'indie')}
          id="publication-filter-indie"
          className={`publications-link indie ${filters.publication === 'indie' ? 'active' : ''}`}
        >
          Indie
        </button>
        <button
          onClick={() => handleFilterChange('publication', 'mainstream')}
          id="publication-filter-mainstream"
          className={`publications-link mainstream ${filters.publication === 'mainstream' ? 'active' : ''}`}
        >
          Mainstream
        </button>
      </div>

      <div id="category-filter" className="filter-section">
        <h5>Categories</h5>
        <button
          onClick={() => handleFilterChange('category', 'all')}
          id="category-filter-all"
          className={`categories-link all-categories ${filters.category === 'all' ? 'active' : ''}`}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange('category', 'politics')}
          id="category-filter-politics"
          className={`categories-link politics ${filters.category === 'politics' ? 'active' : ''}`}
        >
          Politics
        </button>
        <button
          onClick={() => handleFilterChange('category', 'economy')}
          id="category-filter-economy"
          className={`categories-link economy ${filters.category === 'economy' ? 'active' : ''}`}
        >
          Economy
        </button>
        <button
          onClick={() => handleFilterChange('category', 'international')}
          id="category-filter-international"
          className={`categories-link international ${filters.category === 'international' ? 'active' : ''}`}
        >
          International
        </button>
        <button
          onClick={() => handleFilterChange('category', 'tech')}
          id="category-filter-tech"
          className={`categories-link tech-categories ${filters.category === 'tech' ? 'active' : ''}`}
        >
          Science
        </button>
      </div>
    </div>
  );
};

export default ArticleFilters;
