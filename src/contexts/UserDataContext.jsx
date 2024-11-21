import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  fetchSourcesByUserId,
  fetchUpvotesByUserId,
  fetchFeedsByUserId,
} from "../services/userServices";

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    sources: [],
    upvotes: [],
    following: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    if (!user) {
      setUserData({ sources: [], upvotes: [], following: [] });
      setLoading(false);
      return;
    }

    try {
      const sources = await fetchSourcesByUserId(user.id);
      const upvotes = await fetchUpvotesByUserId(user.id);
      const following = await fetchFeedsByUserId(user.id);

      setUserData({ sources, upvotes, following });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data when auth state changes
  useEffect(() => {
    fetchUserData();
  }, [user]);

  const updateUserData = (newData) => {
    setUserData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  return (
    <UserDataContext.Provider
      value={{
        userData,
        loading,
        updateUserData,
        refreshUserData: fetchUserData,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

// Custom hook to use the context
export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
};
