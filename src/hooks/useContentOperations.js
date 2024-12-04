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
      const previousData = queryClient.getQueryData(['userData']);
      
      queryClient.setQueryData(['userData'], old => ({
        ...old,
        sources: old?.sources?.includes(sourceId)
          ? old.sources.filter(id => id !== sourceId)
          : [...(old?.sources || []), sourceId]
      }));

      return { previousData };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['userData'], context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['userData']);
    }
  });

  const upvoteContentMutation = useMutation({
    mutationFn: ({ userId, contentId }) => upvoteContentService(userId, contentId),
    onMutate: async ({ contentId }) => {
      await queryClient.cancelQueries(['userData']);
      await queryClient.cancelQueries(['content', contentId]);
      
      const previousUserData = queryClient.getQueryData(['userData']);
      const previousContent = queryClient.getQueryData(['content', contentId]);

      queryClient.setQueryData(['userData'], old => ({
        ...old,
        upvotes: old?.upvotes?.includes(contentId)
          ? old.upvotes.filter(id => id !== contentId)
          : [...(old?.upvotes || []), contentId]
      }));

      queryClient.setQueryData(['content', contentId], old => ({
        ...old,
        upvotes: old?.upvotes + (previousUserData?.upvotes?.includes(contentId) ? -1 : 1)
      }));

      return { previousUserData, previousContent };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['userData'], context.previousUserData);
      queryClient.setQueryData(['content', contentId], context.previousContent);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['userData']);
      queryClient.invalidateQueries(['content', contentId]);
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
    upvoteContent: upvoteContentMutation,
    addComment: addCommentMutation
  };
}