import React from 'react';
import './FilterContentButton.css';

const FilterContentButton = ({ 
  onClick,
  isActive = false,
  children,
  id = '',
  className = '',
  disabled = false,
  size = 'medium' // small, medium, large
}) => {
  return (
    <button
      onClick={onClick}
      id={id}
      disabled={disabled}
      className={`filter-content-button ${size} ${isActive ? 'active' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default FilterContentButton;