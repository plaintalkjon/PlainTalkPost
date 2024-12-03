import { useQuery } from '@tanstack/react-query';
import { fetchRecommendedFeedsByUserIdAndFollowedFeeds } from '@services/userServices';

export function useSystemRecommendations(userId, following = []) {
  return useQuery({
    queryKey: ['systemRecommendations', userId, following],
    queryFn: async () => {
      // For logged-in users, get personalized recommendations
      if (userId) {
        return await fetchRecommendedFeedsByUserIdAndFollowedFeeds(
          userId, 
          following
        );
      }
      
      // For non-logged-in users, get general recommendations
      return await fetchRecommendedFeedsByUserIdAndFollowedFeeds(null, []);
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
}