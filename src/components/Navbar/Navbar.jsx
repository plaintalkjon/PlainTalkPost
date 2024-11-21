// src/components/Navbar/Navbar.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { logout } from '../../services/authServices';
import supabase from "../../utility/SupabaseClient";
import "./Navbar.css";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const [username, setUsername] = useState(null);

  // Fetch username when user is logged in
  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_profile')
          .select('username')
          .eq('user_id', user.id)
          .single();
          
        if (data) {
          setUsername(data.username);
        }
      }
    };

    fetchUsername();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-logo">
          <img className="navbar-logo" src="/img/plain-talk-post-logo.png" alt="Logo" />
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          {user && username && (
            <>
              <li>
                <Link to={`/profile/${username}`}>Profile</Link>
              </li>
            </>
          )}
          {user && (
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          )}
          <li>
            {user ? (
              <Link 
                to="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                Log Off
              </Link>
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
