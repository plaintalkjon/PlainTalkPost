import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchContent } from "@services/contentServices";

export function useContent({ filters, feedFilter, userData }) {
  return useInfiniteQuery({
    queryKey: ['content', filters, feedFilter, userData?.sources],
    queryFn: async ({ pageParam = [] }) => {
      const options = {
        ...filters,
        sources: feedFilter === "yourFeed" ? userData?.sources : [],
        loadedContentIds: pageParam,
      };

      try {
        const results = await fetchContent(options);
        return {
          items: results,
          nextCursor: results.map(content => content.content_id),
        };
      } catch (error) {
        console.error('Error fetching content:', error);
        throw error;
      }
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.items?.length) return undefined;
      return lastPage.nextCursor;
    },
    initialPageParam: [],
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    cacheTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    retry: 2, // Retry failed requests twice
  });
}

export function useNewContentCheck({ filters, feedFilter, userData, newestTimestamp }) {
  return useQuery({
    queryKey: ['newContent', filters, feedFilter, newestTimestamp],
    queryFn: async () => {
      if (!newestTimestamp) return false;
      
      const options = {
        ...filters,
        sources: feedFilter === "yourFeed" ? userData?.sources : [],
        limit: 1,
        newerThan: newestTimestamp,
      };

      try {
        const newer = await fetchContent(options);
        return newer.length > 0;
      } catch (error) {
        console.error('Error checking for new content:', error);
        return false; // Return false instead of throwing on error
      }
    },
    enabled: !!newestTimestamp && !!userData,
    refetchInterval: 60000, // Check every minute
    staleTime: 30000, // Consider check fresh for 30 seconds
    cacheTime: 60000, // Cache results for 1 minute
    retry: 1, // Only retry once for new content checks
    refetchOnWindowFocus: true, // Do refetch when window regains focus
  });
}
