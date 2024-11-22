// src/components/Navbar/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useUserProfile } from "../../hooks/useUserProfile";
import { logout } from '../../services/authServices';
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { 
    data: profile,
    isLoading,
    isError 
  } = useUserProfile(user?.id);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-logo">
          <img 
            className="navbar-logo" 
            src="/img/plain-talk-post-logo.png" 
            alt="Logo" 
          />
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          {user && !isLoading && !isError && profile?.username && (
            <>
              <li>
                <Link to={`/profile/${profile.username}`}>Profile</Link>
              </li>
              <li>
                <Link to="/settings">Settings</Link>
              </li>
            </>
          )}
          <li>
            {user ? (
              <button 
                className="nav-link-button"
                onClick={handleLogout}
              >
                Log Off
              </button>
            ) : (
              <Link to="/login">Log On</Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
