// src/components/Navbar/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { logout } from "@services/authServices";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, userProfile, setUser } = useAuth();

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
    navigate(path);
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
            <button className="nav-button" onClick={() => handleNavClick("/")}>
              Home
            </button>
          </li>
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
