import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleFollowFeed } from '@services/followServices';

export function useFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, username }) => {
      await toggleFollowFeed(userId, username);
    },
    onMutate: async ({ username }) => {
      await queryClient.cancelQueries(['userData']);
      const previousData = queryClient.getQueryData(['userData']);
      
      queryClient.setQueryData(['userData'], old => {
        const isFollowing = old?.following?.includes(username);
        return {
          ...old,
          following: isFollowing
            ? old.following.filter(name => name !== username)
            : [...(old?.following || []), username]
        };
      });

      return { previousData };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['userData'], context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['userData']);
    }
  });
}