import React, { useState } from "react";
import { resetPassword } from "@services/authServices";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
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

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Forgot Password</h2>
        {error && <div className="error-message">{error}</div>}
        {resetSent && (
          <div className="success-message">
            Password reset email sent! Check your inbox.
          </div>
        )}
        <form onSubmit={handleForgotPassword}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="reset-button">
            Send Reset Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
