import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSourcesByUserId, fetchUpvotesByUserId, fetchFeedsByUserId } from '../services/userServices'

export function useUserData(userId) {
  return useQuery({
    queryKey: ['userData', userId],
    queryFn: async () => {
      if (!userId) return { sources: [], upvotes: [], following: [] }
      
      try {
        const [sources, upvotes, following] = await Promise.all([
          fetchSourcesByUserId(userId),
          fetchUpvotesByUserId(userId),
          fetchFeedsByUserId(userId)
        ])
        
        return {
          sources: sources || [],
          upvotes: upvotes || [],
          following: following || []
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        throw error
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    refetchOnMount: true
  })
}

export function useUpdateUserData() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (newData) => {
      // Your update API call here
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(['userData'])
    }
  })
}