import { createContext, useContext, useState, useEffect } from "react";
import supabase from "@utility/SupabaseClient";

// Create the context
const AuthContext = createContext({});

// Export the provider component (this is used in main.jsx)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Auth error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', {
          event,
          hasSession: !!session,
          timestamp: new Date().toISOString()
        });
        
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    // Add profile fetch when user changes
    const fetchUserProfile = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('user_profile')
          .select('username, profile_picture')
          .eq('user_id', userId)
          .single();
          
        if (error) throw error;
        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (user?.id) {
      fetchUserProfile(user.id);
    }
  }, [user]);

  // Update the context value to include userProfile
  const value = {
    user,
    userProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the hook to use the context
export const useAuth = () => useContext(AuthContext);
