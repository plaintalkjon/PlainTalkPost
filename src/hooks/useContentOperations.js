import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleFollowSource } from '../services/followServices';
import { upvoteContent } from '../services/contentServices';
import { addComment } from '../services/commentServices';

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

  const upvoteContent = useMutation({
    mutationFn: ({ userId, contentId }) => upvoteContent(userId, contentId),
    onMutate: async ({ contentId }) => {
      await queryClient.cancelQueries(['userData']);
      const previousData = queryClient.getQueryData(['userData']);
      
      queryClient.setQueryData(['userData'], old => ({
        ...old,
        upvotes: old?.upvotes?.includes(contentId)
          ? old.upvotes.filter(id => id !== contentId)
          : [...(old?.upvotes || []), contentId]
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