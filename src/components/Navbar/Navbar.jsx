import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Uncommenting this if you have styles here

const Navbar = () => {
  return (
    <nav id="navbar">
      <div className="navbar-logo">
        <img src="img/plain-talk-post-logo.png" alt="Plain Talk Post Logo" />{" "}
        {/* Adding alt attribute */}
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
        <li>
          <Link to="/login">Log On</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
