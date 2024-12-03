import { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "@utility/SupabaseClient";
import { useUserProfile } from "@hooks/useUserProfile";
import { 
  fetchSourcesByUserId, 
  fetchUpvotesByUserId, 
  fetchFeedsByUserId 
} from "@services/userServices";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // User Profile Query
  const { data: userProfile } = useUserProfile(user?.id);

  // User Data Query
  const { data: userData = { sources: [], upvotes: [], following: [] } } = useQuery({
    queryKey: ['userData', user?.id],
    queryFn: async () => {
      const [sources, upvotes, following] = await Promise.all([
        fetchSourcesByUserId(user.id),
        fetchUpvotesByUserId(user.id),
        fetchFeedsByUserId(user.id)
      ]);

      return {
        sources: sources || [],
        upvotes: upvotes || [],
        following: following || []
      };
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  // Auth state management
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
        setUser(session?.user ?? null);
        setLoading(false);

        // Clear queries when user logs out
        if (!session?.user) {
          queryClient.clear();
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const value = {
    user,
    userProfile,
    userData,
    loading,
    refreshUserData: () => {
      if (user?.id) {
        queryClient.invalidateQueries(['userData', user.id]);
        queryClient.invalidateQueries(['userProfile', user.id]);
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
