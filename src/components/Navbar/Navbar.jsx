// src/components/Navbar/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // Import AuthContext
import supabase from "../../utility/SupabaseClient";
import "./Navbar.css";

const Navbar = ({ onLoginClick }) => {
  const { user, setUser } = useAuth(); // Access user and setUser from AuthContext

  // Logout handler to log the user out and update the auth context
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); // Clear user state in AuthContext
  };

  return (
    <nav id="navbar">
      <div className="navbar-logo">
        <img src="img/plain-talk-post-logo.png" alt="Plain Talk Post Logo" />
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
        <li>
          {user ? (
            // If user is logged in, show Log Off
            <Link to="#" onClick={(e) => {
                e.preventDefault();
                handleLogout(); // Log out the user
              }}
            >
              Log Off
            </Link>
          ) : (
            // If user is not logged in, show Log On and open login modal
            <Link to="#" onClick={(e) => {
                e.preventDefault();
                onLoginClick(); // Open login modal
              }}
            >
              Log On
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
