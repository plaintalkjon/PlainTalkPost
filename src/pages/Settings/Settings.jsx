import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useUpdateSettings, useProfilePictureUpload, validateSettings } from "../../hooks/useSettings";
import "./Settings.css";

const Settings = () => {
  const { user } = useAuth();
  const updateSettingsMutation = useUpdateSettings();
  const profilePictureMutation = useProfilePictureUpload();

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    repeatPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('settings-', '')]: value
    }));
  };

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      validateSettings.file(file);
      
      await profilePictureMutation.mutateAsync(
        { userId: user.id, file },
        {
          onSuccess: () => {
            setMessage("Profile picture updated successfully!");
          },
        }
      );
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      validateSettings.form(formData);

      await updateSettingsMutation.mutateAsync(
        {
          userId: user.id,
          settings: {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }
        },
        {
          onSuccess: () => {
            setMessage("Settings updated successfully!");
            setFormData(prev => ({ 
              ...prev, 
              password: "", 
              repeatPassword: "" 
            }));
          },
        }
      );
    } catch (error) {
      setMessage(error.message);
    }
  };

  const isLoading = updateSettingsMutation.isPending || profilePictureMutation.isPending;

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
      </div>

      <div className="profile-pic-section">
        <label htmlFor="profilePictureInput" className="profile-pic-label">
          <img
            className="profile-pic"
            src={user?.profile_picture
              ? `https://plaintalkpostuploads.nyc3.digitaloceanspaces.com/uploads/profile_pictures/${user.profile_picture}`
              : "/img/default-profile.png"
            }
            alt="Profile"
            onError={(e) => {
              e.target.src = "/img/default-profile.png";
            }}
          />
          <div className="profile-pic-overlay">
            <span>Change Picture</span>
          </div>
        </label>
        <input
          type="file"
          id="profilePictureInput"
          accept="image/jpeg,image/jpg,image/png"
          style={{ display: "none" }}
          onChange={handleProfilePictureChange}
          disabled={isLoading}
        />
      </div>

      <div className="settings-form-section">
        <form id="settings-form" onSubmit={handleFormSubmit}>
          {/* Form fields remain the same */}
          <label htmlFor="settings-username">Username</label>
          <input
            type="text"
            id="settings-username"
            value={formData.username}
            onChange={handleInputChange}
            disabled={isLoading}
          />

          <label htmlFor="settings-email">Email</label>
          <input
            type="email"
            id="settings-email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
          />

          <label htmlFor="settings-password">New Password</label>
          <input
            type="password"
            id="settings-password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
          />

          <label htmlFor="settings-repeat-password">Repeat New Password</label>
          <input
            type="password"
            id="settings-repeat-password"
            value={formData.repeatPassword}
            onChange={handleInputChange}
            disabled={isLoading}
          />

          <button 
            type="submit" 
            className="save-button"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>

      {message && (
        <div className={`settings-message ${
          message.includes("Error") ? "error" : "success"
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Settings;