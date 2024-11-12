// src/components/LoginModal/LoginModal.jsx
import React, { useState } from 'react';
import { login, signup } from '../../services/authServices';
import { useAuth } from '../../contexts/AuthContext.jsx';

const LoginModal = ({ onClose }) => {
  const { setUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const session = await login(formData.email, formData.password);
        setUser(session.user); // Update the auth context with the logged-in user
      } else {
        const session = await signup(formData.email, formData.password, formData.username);
        setUser(session.user);
      }
      onClose();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div id="loginModal" className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <div className="loginsignup">
          <h2 onClick={() => setIsLogin(true)} className={isLogin ? 'active' : ''}>Log In</h2>
          <h2 onClick={() => setIsLogin(false)} className={!isLogin ? 'active' : ''}>Sign Up</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <br />
          {!isLogin && (
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          )}
          <br />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <br />
          <button type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
