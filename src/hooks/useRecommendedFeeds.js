import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '../utility/SupabaseClient';

// Get recommendations
export function useRecommendedFeeds(profileUserId) {
  return useQuery({
    queryKey: ['recommendedFeeds', profileUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_feed_recommendation')
        .select(`
          feed_id,
          user_profile!user_id (
            username,
            profile_picture
          )
        `)
        .eq('user_id', profileUserId)
        .limit(3);

      if (error) throw error;
      return data || [];
    },
    enabled: !!profileUserId,
  });
}

// Search users
export function useUserSearch(searchTerm, profileUserId, currentRecommendations) {
  return useQuery({
    queryKey: ['userSearch', searchTerm, profileUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profile')
        .select('user_id, username, profile_picture')
        .ilike('username', `%${searchTerm}%`)
        .limit(5);

      if (error) throw error;
      
      return data.filter(user => 
        user.user_id !== profileUserId && 
        !currentRecommendations.some(rec => rec.feed_id === user.user_id)
      );
    },
    enabled: searchTerm.length >= 2,
  });
}

// Mutations for adding/removing recommendations
export function useRecommendationMutations() {
  const queryClient = useQueryClient();

  const addRecommendation = useMutation({
    mutationFn: async ({ profileUserId, recommendedUser }) => {
      const { error } = await supabase
        .from('user_feed_recommendation')
        .insert({
          user_id: profileUserId,
          feed_id: recommendedUser.user_id
        });
      if (error) throw error;
    },
    onSuccess: (_, { profileUserId }) => {
      queryClient.invalidateQueries(['recommendedFeeds', profileUserId]);
    },
  });

  const removeRecommendation = useMutation({
    mutationFn: async ({ profileUserId, feedId }) => {
      const { error } = await supabase
        .from('user_feed_recommendation')
        .delete()
        .match({ 
          user_id: profileUserId,
          feed_id: feedId 
        });
      if (error) throw error;
    },
    onSuccess: (_, { profileUserId }) => {
      queryClient.invalidateQueries(['recommendedFeeds', profileUserId]);
    },
  });

  return { addRecommendation, removeRecommendation };
}