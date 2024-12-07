import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleFollowSource } from "@services/followServices";
import { upvoteContent as upvoteContentService } from "@services/contentServices";
import { addComment } from "@services/commentServices";

// Export as a single object
export const useContentOperations = (contentId) => {
  const queryClient = useQueryClient();
  
  const followSource = useMutation({
    mutationFn: ({ userId, sourceId }) => toggleFollowSource(userId, sourceId),
    onMutate: async ({ sourceId }) => {
      await queryClient.cancelQueries(['userData']);
      
      const previousUserData = queryClient.getQueryData(['userData']);
      
      queryClient.setQueryData(['userData'], old => ({
        ...old,
        sources: old?.sources?.includes(sourceId)
          ? old.sources.filter(id => id !== sourceId)
          : [...(old?.sources || []), sourceId]
      }));

      return { previousUserData };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['userData'], context.previousUserData);
    },
    onSuccess: () => {
      // Instead of invalidating, we'll rely on our optimistic update
      // queryClient.invalidateQueries(['userData']); // Remove this line
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