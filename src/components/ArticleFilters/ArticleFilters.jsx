// src/components/ArticleFilters/ArticleFilters.jsx
import React from 'react';
import './ArticleFilters.css';

const ArticleFilters = ({ filters, setFilters }) => {
  // Helper function to update a filter based on filter name and value
  const handleFilterChange = (filterName, value) => {

    if (filters[filterName] === value) {
      return; // This prevents a bug where clicking on a filter would call it again but the loadedArticles would have the old values in it, resulting in skipping a page of articles because they're filtered out.
    }
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
          onClick={() => handleFilterChange('mediaType', null)}
          id="media-filter-all"
          className={`media-link ${filters.mediaType === null ? 'active' : ''}`}
        >
          All Media
        </button>
        <button
          onClick={() => handleFilterChange('mediaType', 'Article')}
          id="media-filter-articles"
          className={`media-link ${filters.mediaType === 'Article' ? 'active' : ''}`}
        >
          Articles
        </button>
        <button
          onClick={() => handleFilterChange('mediaType', 'Video')}
          id="media-filter-videos"
          className={`media-link ${filters.mediaType === 'Video' ? 'active' : ''}`}
        >
          Videos
        </button>
      </div>

      <div id="bias-filter" className="filter-section">
        <h5>Political Bias</h5>
        <button
          onClick={() => handleFilterChange('bias', null)}
          id="bias-filter-all"
          className={`filter-link balanced ${filters.bias === null ? 'active' : ''}`}
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
          onClick={() => handleFilterChange('bias', 'leanleft')}
          id="bias-filter-leanleft"
          className={`filter-link leanleft ${filters.bias === 'leanleft' ? 'active' : ''}`}
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
          onClick={() => handleFilterChange('bias', 'leanright')}
          id="bias-filter-leanright"
          className={`filter-link leanright ${filters.bias === 'leanright' ? 'active' : ''}`}
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
          onClick={() => handleFilterChange('publication', null)}
          id="publication-filter-all"
          className={`publications-link all ${filters.publication === null ? 'active' : ''}`}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange('publication', 'Indie')}
          id="publication-filter-indie"
          className={`publications-link indie ${filters.publication === 'Indie' ? 'active' : ''}`}
        >
          Indie
        </button>
        <button
          onClick={() => handleFilterChange('publication', 'Mainstream')}
          id="publication-filter-mainstream"
          className={`publications-link mainstream ${filters.publication === 'Mainstream' ? 'active' : ''}`}
        >
          Mainstream
        </button>
      </div>

      <div id="category-filter" className="filter-section">
        <h5>Categories</h5>
        <button
          onClick={() => handleFilterChange('category', null)}
          id="category-filter-all"
          className={`categories-link all-categories ${filters.category === null ? 'active' : ''}`}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange('category', 'Politics & Policy')}
          id="category-filter-politics"
          className={`categories-link politics ${filters.category === 'Politics & Policy' ? 'active' : ''}`}
        >
          Politics & Policy
        </button>
        <button
          onClick={() => handleFilterChange('category', 'Economy & Business')}
          id="category-filter-economy"
          className={`categories-link economy ${filters.category === 'Economy & Business' ? 'active' : ''}`}
        >
          Economy & Business
        </button>
        <button
          onClick={() => handleFilterChange('category', 'International')}
          id="category-filter-international"
          className={`categories-link international ${filters.category === 'International' ? 'active' : ''}`}
        >
          International
        </button>
        <button
          onClick={() => handleFilterChange('category', 'Tech & Science')}
          id="category-filter-tech"
          className={`categories-link tech-categories ${filters.category === 'Tech & Science' ? 'active' : ''}`}
        >
          Tech & Science
        </button>
      </div>
    </div>
  );
};

export default ArticleFilters;
