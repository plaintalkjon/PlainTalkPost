import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { updateSettings, uploadPicture as uploadProfilePicture } from "../../services/settingsServices";
import "./Settings.css";

const Settings = () => {
  const { user } = useAuth(); // Get current user from auth context

  // Consolidated form state into a single object for better management
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    repeatPassword: "",
  });

  // State for profile picture URL
  const [profilePic, setProfilePic] = useState(user?.profile_picture || "/default-profile-pic.png");
  // State for feedback messages to user
  const [message, setMessage] = useState("");
  // Loading state for async operations
  const [loading, setLoading] = useState(false);

  // Generic handler for all form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      // Remove 'settings-' prefix from id to match state keys
      [id.replace('settings-', '')]: value
    }));
  };

  // Handler for profile picture file upload
  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // File validation
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      setMessage("Only JPG, JPEG and PNG images are allowed.");
      return;
    }
    // Check file size
    if (file.size > maxSize) {
      setMessage("File size must be less than 5MB.");
      return;
    }

    // Upload profile picture
    setLoading(true);
    try {
      const { profilePicUrl } = await uploadProfilePicture(user.id, file);
      setProfilePic(profilePicUrl);
      setMessage("Profile picture updated successfully!");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler for form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const { username, email, password, repeatPassword } = formData;

    // Validation checks
    if (!username && !email && !password) {
      setMessage("Please update at least one field.");
      return;
    }

    if (password && password !== repeatPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    // Update user settings
    setLoading(true);
    try {
      const result = await updateSettings(user.id, { username, email, password });
      setMessage(result.message || "Settings updated successfully!");
      // Clear sensitive data after successful update
      setFormData(prev => ({ ...prev, password: "", repeatPassword: "" }));
    } catch (error) {
      setMessage(error.message || "Failed to update settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
      </div>

      {/* Profile Picture Section */}
      <div className="profile-pic-section">
        <label htmlFor="profilePictureInput">
          <img
            className="profile-pic"
            src={`https://plaintalkpostuploads.nyc3.digitaloceanspaces.com/uploads/profile_pictures/${profilePic}`}
            alt="Profile"
            loading="lazy"
          />
        </label>
        <input
          type="file"
          id="profilePictureInput"
          accept="image/jpeg,image/jpg,image/png"
          style={{ display: "none" }}
          onChange={handleProfilePictureChange}
        />
      </div>

      {/* Settings Form Section */}
      <div className="settings-form-section">
        <form id="settings-form" onSubmit={handleFormSubmit}>
          {/* Username Field */}
          <label htmlFor="settings-username">Username</label>
          <input
            type="text"
            id="settings-username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
          />

          {/* Email Field */}
          <label htmlFor="settings-email">Email</label>
          <input
            type="email"
            id="settings-email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />

          {/* Password Field */}
          <label htmlFor="settings-password">Password</label>
          <input
            type="password"
            id="settings-password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />

          {/* Repeat Password Field */}
          <label htmlFor="settings-repeat-password">Repeat Password</label>
          <input
            type="password"
            id="settings-repeat-password"
            placeholder="Repeat Password"
            value={formData.repeatPassword}
            onChange={handleInputChange}
          />

          {/* Submit Button */}
          <button 
            type="submit" 
            className="save-button"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>

      {/* Feedback Message Display */}
      {message && (
        <div className="settings-message">
          {message}
        </div>
      )}
    </div>
  );
};

export default Settings;
