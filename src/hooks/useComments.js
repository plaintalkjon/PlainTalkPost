import { useQuery } from '@tanstack/react-query';
import { fetchCommentsByContentId } from "@services/commentServices";

export function useComments(contentId) {
  return useQuery({
    queryKey: ['comments', contentId],
    queryFn: () => fetchCommentsByContentId(contentId),
    staleTime: 1000 * 30, // Consider comments fresh for 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute for new comments
  });
}

// Utility function for timestamp formatting
export function formatTimestamp(timestamp) {
  const now = new Date();
  const commentDate = new Date(timestamp);
  const diffInHours = Math.floor((now - commentDate) / (1000 * 60 * 60));
  const diffInMinutes = Math.floor((now - commentDate) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min. ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hr. ago`;
  } else {
    return commentDate.toLocaleDateString();
  }
}