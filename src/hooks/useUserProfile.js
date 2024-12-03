import { useQuery } from '@tanstack/react-query';
import supabase from '@utility/SupabaseClient';

export function useUserProfile(userId) {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profile')
        .select('username')
        .eq('user_id', userId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 30, // Consider profile data fresh for 30 minutes
  });
}