// src/components/ContentFilters/ContentFilters.jsx
import React from 'react';
import { useContentFilters } from '../../hooks/useContentFilters';
import './ContentFilters.css';

const ContentFilters = () => {
  const { filters, updateFilter } = useContentFilters();

  return (
    <div id="filters-container">
      <p id="errorMessage" style={{ color: 'red' }}></p>

      <div id="sort-filter" className="filter-section">
        <h5>Sort By</h5>
        <div className="sorting">
          <button
            onClick={() => updateFilter('sort', 'trending')}
            id="sort-filter-trending"
            className={`sorting-link trending ${filters.sort === 'trending' ? 'active' : ''}`}
          >
            Trending
          </button>
          <button
            onClick={() => updateFilter('sort', 'latest')}
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
          onClick={() => updateFilter('mediaType', null)}
          id="media-filter-all"
          className={`media-link ${filters.mediaType === null ? 'active' : ''}`}
        >
          All Media
        </button>
        <button
          onClick={() => updateFilter('mediaType', 'Content')}
          id="media-filter-content"
          className={`media-link ${filters.mediaType === 'Content' ? 'active' : ''}`}
        >
          Content
        </button>
        <button
          onClick={() => updateFilter('mediaType', 'Video')}
          id="media-filter-videos"
          className={`media-link ${filters.mediaType === 'Video' ? 'active' : ''}`}
        >
          Videos
        </button>
      </div>

      <div id="bias-filter" className="filter-section">
        <h5>Political Bias</h5>
        <button
          onClick={() => updateFilter('bias', null)}
          id="bias-filter-all"
          className={`filter-link balanced ${filters.bias === null ? 'active' : ''}`}
        >
          All Bias
        </button>
        <button
          onClick={() => updateFilter('bias', 'left')}
          id="bias-filter-left"
          className={`filter-link left ${filters.bias === 'left' ? 'active' : ''}`}
        >
          Left
        </button>
        <button
          onClick={() => updateFilter('bias', 'leanleft')}
          id="bias-filter-leanleft"
          className={`filter-link leanleft ${filters.bias === 'leanleft' ? 'active' : ''}`}
        >
          Left Lean
        </button>
        <button
          onClick={() => updateFilter('bias', 'center')}
          id="bias-filter-center"
          className={`filter-link center ${filters.bias === 'center' ? 'active' : ''}`}
        >
          Center
        </button>
        <button
          onClick={() => updateFilter('bias', 'leanright')}
          id="bias-filter-leanright"
          className={`filter-link leanright ${filters.bias === 'leanright' ? 'active' : ''}`}
        >
          Right Lean
        </button>
        <button
          onClick={() => updateFilter('bias', 'right')}
          id="bias-filter-right"
          className={`filter-link right ${filters.bias === 'right' ? 'active' : ''}`}
        >
          Right
        </button>
      </div>

      <div id="publication-filter" className="filter-section">
        <h5>Publications</h5>
        <button
          onClick={() => updateFilter('publication', null)}
          id="publication-filter-all"
          className={`publications-link all ${filters.publication === null ? 'active' : ''}`}
        >
          All
        </button>
        <button
          onClick={() => updateFilter('publication', 'Indie')}
          id="publication-filter-indie"
          className={`publications-link indie ${filters.publication === 'Indie' ? 'active' : ''}`}
        >
          Indie
        </button>
        <button
          onClick={() => updateFilter('publication', 'Mainstream')}
          id="publication-filter-mainstream"
          className={`publications-link mainstream ${filters.publication === 'Mainstream' ? 'active' : ''}`}
        >
          Mainstream
        </button>
      </div>

      <div id="category-filter" className="filter-section">
        <h5>Categories</h5>
        <button
          onClick={() => updateFilter('category', null)}
          id="category-filter-all"
          className={`categories-link all-categories ${filters.category === null ? 'active' : ''}`}
        >
          All
        </button>
        <button
          onClick={() => updateFilter('category', 'Politics & Policy')}
          id="category-filter-politics"
          className={`categories-link politics ${filters.category === 'Politics & Policy' ? 'active' : ''}`}
        >
          Politics & Policy
        </button>
        <button
          onClick={() => updateFilter('category', 'Economy & Business')}
          id="category-filter-economy"
          className={`categories-link economy ${filters.category === 'Economy & Business' ? 'active' : ''}`}
        >
          Economy & Business
        </button>
        <button
          onClick={() => updateFilter('category', 'International')}
          id="category-filter-international"
          className={`categories-link international ${filters.category === 'International' ? 'active' : ''}`}
        >
          International
        </button>
        <button
          onClick={() => updateFilter('category', 'Tech & Science')}
          id="category-filter-tech"
          className={`categories-link tech-categories ${filters.category === 'Tech & Science' ? 'active' : ''}`}
        >
          Tech & Science
        </button>
      </div>
    </div>
  );
};

export default ContentFilters;
