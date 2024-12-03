import { useQuery } from '@tanstack/react-query';
import { fetchUserIdAndProfilePictureByUsername } from '@services/userServices';

export function useProfile(username) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchUserIdAndProfilePictureByUsername(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 5, // Consider profile data fresh for 5 minutes
  });
}