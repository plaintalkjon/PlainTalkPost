import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleFollowSource } from "@services/followServices";
import { upvoteContent as upvoteContentService } from "@services/contentServices";
import { addComment } from "@services/commentServices";

// Export as a single object
export const useContentOperations = (contentId) => {
  const queryClient = useQueryClient();
  
  const followSource = useMutation({
    mutationFn: async({ userId, sourceId }) => {
      await toggleFollowSource(userId, sourceId);
    },
    onMutate: async ({ sourceId }) => {
      // Cancel any outgoing refetches
      await Promise.all([
        queryClient.cancelQueries(['userData']),
        queryClient.cancelQueries(['content']),
        queryClient.cancelQueries(['starterPacks']),
        queryClient.cancelQueries(['sources']),
      ]);
      
      // Snapshot the previous values
      const previousData = {
        userData: queryClient.getQueryData(['userData']),
        content: queryClient.getQueryData(['content']),
        starterPacks: queryClient.getQueryData(['starterPacks']),
        sources: queryClient.getQueryData(['sources']),
      };
      
      // Optimistically update userData
      queryClient.setQueryData(['userData'], old => {
        const isFollowing = old?.sources?.includes(sourceId);
        return {
          ...old,
          sources: isFollowing
            ? old.sources.filter(id => id !== sourceId)
            : [...(old?.sources || []), sourceId]
        };
      });

      // Update content items that contain this source
      queryClient.setQueryData(['content'], old => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            items: page.items.map(item => 
              item.source_id === sourceId 
                ? { ...item, is_following: !item.is_following }
                : item
            )
          }))
        };
      });

      // Update starter packs
      queryClient.setQueryData(['starterPacks'], old => {
        if (!old) return old;
        return old.map(pack => ({
          ...pack,
          sources: pack.sources.map(source =>
            source.source_id === sourceId
              ? { ...source, is_following: !source.is_following }
              : source
          )
        }));
      });

      // Update sources list
      queryClient.setQueryData(['sources'], old => {
        if (!old) return old;
        return old.map(source =>
          source.source_id === sourceId
            ? { ...source, is_following: !source.is_following }
            : source
        );
      });

      return previousData;
    },
    onError: (_, __, context) => {
      // If mutation fails, use the context to roll back
      queryClient.setQueryData(['userData'], context.userData);
      queryClient.setQueryData(['content'], context.content);
      queryClient.setQueryData(['starterPacks'], context.starterPacks);
      queryClient.setQueryData(['sources'], context.sources);
    },
    onSettled: () => {
      // Refetch to ensure server state
      queryClient.invalidateQueries(['userData']);
      queryClient.invalidateQueries(['content']);
      queryClient.invalidateQueries(['starterPacks']);
      queryClient.invalidateQueries(['sources']);
    }
  });

  const upvoteContent = useMutation({
    mutationFn: ({ userId, contentId }) => upvoteContentService(userId, contentId),
    onMutate: async ({ contentId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(['userData']);
      
      // Snapshot the previous values
      const previousUserData = queryClient.getQueryData(['userData']);
      
      // Optimistically update userData
      queryClient.setQueryData(['userData'], old => ({
        ...old,
        upvotes: old?.upvotes?.includes(contentId)
          ? old.upvotes.filter(id => id !== contentId)
          : [...(old?.upvotes || []), contentId]
      }));

      // Return context with the snapshotted value
      return { previousUserData };
    },
    onError: (_, __, context) => {
      // If mutation fails, use the context to roll back
      queryClient.setQueryData(['userData'], context.previousUserData);
    },
    onSuccess: () => {
      // Rely on optimistic update instead of invalidating
      // queryClient.invalidateQueries(['userData']); // Remove this line
    }
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ userId, contentId, text, userProfile }) => 
      addComment(userId, contentId, text),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', contentId]);
    }
  });

  return {
    followSource,
    upvoteContent,
    addComment: addCommentMutation
  };
}