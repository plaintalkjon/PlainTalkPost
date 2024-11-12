// src/App.js
import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import LoginModal from "./components/LoginModal/LoginModal";
import { AuthProvider } from "./contexts/AuthContext.jsx";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AuthProvider>
      <Navbar onLoginClick={() => setIsModalOpen(true)} />
      {isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} />}
      <Home />
    </AuthProvider>
  );
}

export default App;
