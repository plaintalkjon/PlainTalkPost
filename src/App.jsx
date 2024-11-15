// src/App.jsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import LoginModal from "./components/LoginModal/LoginModal";
import Profile from "./pages/Profile/Profile";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Navbar onLoginClick={() => setIsModalOpen(true)} />
      {isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} />}
      <Routes>
        {/* Define routes here */}
        <Route path="/" element={<Home />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
