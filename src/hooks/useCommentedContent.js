import { useQuery } from '@tanstack/react-query';
import supabase from '../utility/SupabaseClient';

export function useCommentedContent(profileUserId) {
  return useQuery({
    queryKey: ['commentedContent', profileUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_content_comments')
        .select(`
          content_id,
          content:content_id (
            *,
            source:source_id (*)
          )
        `)
        .eq('user_id', profileUserId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Remove duplicates and keep only the most recent comment for each content
      const uniqueContent = data.reduce((acc, current) => {
        if (!acc.find(item => item.content_id === current.content_id)) {
          acc.push(current);
        }
        return acc;
      }, []);

      return uniqueContent.map(item => item.content);
    },
    enabled: !!profileUserId,
    staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
  });
}