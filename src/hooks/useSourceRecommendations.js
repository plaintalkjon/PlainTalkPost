import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@utility/SupabaseClient';

// Hook for fetching recommendations
export function useSourceRecommendations(profileUserId) {
  return useQuery({
    queryKey: ['sourceRecommendations', profileUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_source_recommendation')
        .select(`
          source_id,
          source:source_id (
            name,
            political_bias
          )
        `)
        .eq('user_id', profileUserId)
        .limit(3);

      if (error) throw error;
      return data || [];
    },
    enabled: !!profileUserId,
  });
}

// Hook for searching sources
export function useSourceSearch(searchTerm, currentRecommendations) {
  return useQuery({
    queryKey: ['sourceSearch', searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('source')
        .select('source_id, name, political_bias')
        .ilike('name', `%${searchTerm}%`)
        .limit(5);

      if (error) throw error;
      
      // Filter out already recommended sources
      return data.filter(source => 
        !currentRecommendations.some(rec => rec.source_id === source.source_id)
      );
    },
    enabled: searchTerm.length >= 2,
  });
}

// Hook for recommendation mutations
export function useRecommendationMutations(profileUserId) {
  const queryClient = useQueryClient();

  const addRecommendation = useMutation({
    mutationFn: async (source) => {
      const { error } = await supabase
        .from('user_source_recommendation')
        .insert({
          user_id: profileUserId,
          source_id: source.source_id
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sourceRecommendations', profileUserId]);
    }
  });

  const removeRecommendation = useMutation({
    mutationFn: async (sourceId) => {
      const { error } = await supabase
        .from('user_source_recommendation')
        .delete()
        .eq('user_id', profileUserId)
        .eq('source_id', sourceId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sourceRecommendations', profileUserId]);
    }
  });

  return {
    addRecommendation,
    removeRecommendation
  };
}