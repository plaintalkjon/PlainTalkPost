import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { logout } from "@services/authServices";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, setUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isHomePage = location.pathname === "/";

  const closeAllMenus = () => {
    // Close nav menu
    setIsMenuOpen(false);
    // Close filters menu
    document.querySelector('#filters-container')?.classList.remove('active');
    // Close recommended feeds menu
    document.querySelector('.system-recommended-feeds')?.classList.remove('active');
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleNavClick = (path) => {
    closeAllMenus();
    navigate(path);
  };

  const toggleMenu = () => {
    if (!isMenuOpen) {
      closeAllMenus();
    }
    setIsMenuOpen(!isMenuOpen);
  };

  // Add click event listener to body to close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      const navLinks = document.querySelector('.navbar-links');
      const filters = document.querySelector('#filters-container');
      const feeds = document.querySelector('.system-recommended-feeds');
      const hamburger = document.querySelector('.hamburger-menu');

      if (!navLinks?.contains(event.target) && 
          !filters?.contains(event.target) && 
          !feeds?.contains(event.target) && 
          !hamburger?.contains(event.target)) {
        closeAllMenus();
      }
    };

    document.body.addEventListener('click', handleClickOutside);
    return () => document.body.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav id="navbar">
      <div className="navbar-container">
        <button className="hamburger-menu" onClick={toggleMenu}>
          ☰
        </button>
        <Link to="/" className="nav-logo">
          <img
            id="navbar-logo"
            src="/img/plain-talk-post-logo.png"
            alt="Logo"
          />
        </Link>
        <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <div className="mobile-menu-header">
            <button className="close-menu" onClick={toggleMenu}>
              ✕
            </button>
          </div>
          <li>
            <button className="nav-button" onClick={() => handleNavClick("/")}>
              Home
            </button>
          </li>
          
          {/* Mobile-only buttons - only show on home page */}
          {isHomePage && (
            <>
              <li className="mobile-only-nav">
                <button 
                  className="nav-button filter-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeAllMenus();
                    document.querySelector('#filters-container')?.classList.add('active');
                  }}
                >
                  Content Filters
                </button>
              </li>
              <li className="mobile-only-nav">
                <button 
                  className="nav-button feeds-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeAllMenus();
                    document.querySelector('.system-recommended-feeds')?.classList.add('active');
                  }}
                >
                  Recommended Feeds
                </button>
              </li>
            </>
          )}

          {user && userProfile?.username && (
            <>
              <li>
                <button
                  className="nav-button"
                  onClick={() => handleNavClick(`/profile/${userProfile.username}`)}
                >
                  Profile
                </button>
              </li>
              <li>
                <button
                  className="nav-button"
                  onClick={() => handleNavClick("/find-sources")}
                >
                  Build Your Feed
                </button>
              </li>
              <li>
                <button
                  className="nav-button"
                  onClick={() => handleNavClick("/settings")}
                >
                  Settings
                </button>
              </li>
            </>
          )}
          <li>
            <button
              className="nav-button"
              onClick={user ? handleLogout : () => handleNavClick("/login")}
            >
              {user ? "Log Off" : "Log On"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;