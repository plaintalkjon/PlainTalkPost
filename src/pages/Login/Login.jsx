import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useLogin, useSignup } from "@hooks/useAuth";
import { useAuth } from "@contexts/AuthContext";
import "./Login.css";

const Login = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'signup');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const loginMutation = useLogin();
  const signupMutation = useSignup();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Update isLogin when mode changes
  useEffect(() => {
    setIsLogin(searchParams.get('mode') !== 'signup');
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      await resetPassword(email);
      setResetSent(true);
      setError("");
    } catch (error) {
      setError("Failed to send reset email. Please check your email address.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const mutation = isLogin ? loginMutation : signupMutation;
    const payload = isLogin 
      ? { 
          email: formData.email, 
          password: formData.password 
        }
      : { 
          email: formData.email, 
          password: formData.password, 
          username: formData.username 
        };

    try {
      await mutation.mutateAsync(payload);
      navigate('/');
    } catch (error) {
      // Error handling is managed by the mutation
    }
  };

  const isLoading = loginMutation.isPending || signupMutation.isPending;
  const error = loginMutation.error || signupMutation.error;

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        {error && (
          <div className="error-message">
            {error.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group password-input-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading 
              ? 'Loading...' 
              : isLogin ? 'Login' : 'Sign Up'
            }
          </button>
        </form>

        <button 
          className="toggle-button"
          onClick={() => {
            setIsLogin(!isLogin);
            setFormData({
              email: '',
              password: '',
              username: '',
            });
          }}
          disabled={isLoading}
        >
          {isLogin 
            ? 'Need an account? Sign up' 
            : 'Already have an account? Login'
          }
        </button>

        <button type="button" className="forgot-password-button">
          <Link to="/forgot-password">Forgot Password?</Link>
        </button>
      </div>
    </div>
  );
};

export default Login;