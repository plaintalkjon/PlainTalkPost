import { useQuery } from '@tanstack/react-query';
import supabase from '@utility/SupabaseClient';

export function useFollowedFeeds(following, options = {}) {
  return useQuery({
    queryKey: ['followedFeeds', following],
    queryFn: async () => {
      if (!following?.length) return [];

      const { data, error } = await supabase
        .from('user_profile')
        .select(`
          username,
          profile_picture,
          feed_id:user_id
        `)
        .in('username', following);

      if (error) throw error;
      return data || [];
    },
    ...options,
    enabled: !!following?.length && (options.enabled !== false)
  });
}