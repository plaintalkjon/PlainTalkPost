// src/components/ContentFilters/ContentFilters.jsx
import React, { useState } from "react";
import { useContentFilters } from "@hooks/useContentFilters";
import FilterContentButton from '@components/atoms/buttons/FilterContentButton/FilterContentButton';
import "./ContentFilters.css";

const ContentFilters = () => {
  const { filters, updateFilter } = useContentFilters();
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div id="filters-container" className={isOpen ? 'active' : ''}>
        <button className="filters-close-button" onClick={toggleFilters}>
          ×
        </button>

        <div id="sort-filter" className="filter-section">
          <h5>Sort By</h5>
          <div className="sorting">
            <FilterContentButton
              onClick={() => updateFilter("sort", "trending")}
              id="sort-filter-trending"
              isActive={filters.sort === "trending"}
              className="trending"
            >
              Trending
            </FilterContentButton>
            <FilterContentButton
              onClick={() => updateFilter("sort", "latest")}
              id="sort-filter-latest"
              isActive={filters.sort === "latest"}
              className="latest"
            >
              Latest
            </FilterContentButton>
          </div>
        </div>

        <div id="media-filter" className="filter-section">
          <h5>Media Type</h5>
          <FilterContentButton
            onClick={() => updateFilter("mediaType", null)}
            id="media-filter-all"
            isActive={filters.mediaType === null}
          >
            All Media
          </FilterContentButton>
          <FilterContentButton
            onClick={() => updateFilter("mediaType", "Article")}
            id="media-filter-article"
            isActive={filters.mediaType === "Article"}
          >
            Articles
          </FilterContentButton>
          <FilterContentButton
            onClick={() => updateFilter("mediaType", "Video")}
            id="media-filter-videos"
            isActive={filters.mediaType === "Video"}
          >
            Videos
          </FilterContentButton>
        </div>

        <div id="bias-filter" className="filter-section">
          <h5>Political Bias</h5>
          <FilterContentButton
            onClick={() => updateFilter("bias", null)}
            id="bias-filter-all"
            isActive={filters.bias === null}
            className="balanced"
          >
            All Bias
          </FilterContentButton>
          <FilterContentButton
            onClick={() => updateFilter("bias", "left")}
            id="bias-filter-left"
            isActive={filters.bias === "left"}
            className="left"
          >
            Left
          </FilterContentButton>
          <FilterContentButton
            onClick={() => updateFilter("bias", "leanleft")}
            id="bias-filter-leanleft"
            isActive={filters.bias === "leanleft"}
            className="leanleft"
          >
            Left Lean
          </FilterContentButton>
          <FilterContentButton
            onClick={() => updateFilter("bias", "center")}
            id="bias-filter-center"
            isActive={filters.bias === "center"}
            className="center"
          >
            Center
          </FilterContentButton>
          <FilterContentButton
            onClick={() => updateFilter("bias", "leanright")}
            id="bias-filter-leanright"
            isActive={filters.bias === "leanright"}
            className="leanright"
          >
            Right Lean
          </FilterContentButton>
          <FilterContentButton
            onClick={() => updateFilter("bias", "right")}
            id="bias-filter-right"
            isActive={filters.bias === "right"}
            className="right"
          >
            Right
          </FilterContentButton>
        </div>

        <div id="publication-filter" className="filter-section">
          <h5>Publications</h5>
          <FilterContentButton
            onClick={() => updateFilter("publication", null)}
            id="publication-filter-all"
            isActive={filters.publication === null}
         >
            All
          </FilterContentButton>
          <FilterContentButton
            onClick={() => updateFilter("publication", "Indie")}
            id="publication-filter-indie"
            isActive={filters.publication === "Indie"}
            className="indie"
          >
            Indie
          </FilterContentButton>
          <FilterContentButton
            onClick={() => updateFilter("publication", "Mainstream")}
            id="publication-filter-mainstream"
            isActive={filters.publication === "Mainstream"}
            className="mainstream"
          >
            Mainstream
          </FilterContentButton>
        </div>

        <div id="category-filter" className="filter-section">
          <h5>Categories</h5>
          <FilterContentButton
            onClick={() => updateFilter("category", null)}
            id="category-filter-all"
            isActive={filters.category === null}
            className="all-categories"
          >
            All
          </FilterContentButton>
          <FilterContentButton
            onClick={() => updateFilter("category", "Politics & Policy")}
            id="category-filter-politics"
            isActive={filters.category === "Politics & Policy"}
            className="politics"
          >
            Politics & Policy
          </FilterContentButton>
          <FilterContentButton
            onClick={() => updateFilter("category", "Economy & Business")}
            id="category-filter-economy"
            isActive={filters.category === "Economy & Business"}
            className="economy"
          >
            Economy & Business
          </FilterContentButton>
          <FilterContentButton
            onClick={() => updateFilter("category", "International")}
            id="category-filter-international"
            isActive={filters.category === "International"}
            className="international"
          >
            International
          </FilterContentButton>
          <FilterContentButton
            onClick={() => updateFilter("category", "Tech & Science")}
            id="category-filter-tech"
            isActive={filters.category === "Tech & Science"}
            className="tech-categories"
          >
            Tech & Science
          </FilterContentButton>
        </div>
      </div>
    </>
  );
};

export default ContentFilters;
