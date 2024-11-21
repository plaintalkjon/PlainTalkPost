import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const defaultFilters = {
  sort: "trending",
  mediaType: null,
  bias: null,
  publication: null,
  category: null,
};

export function useContentFilters() {
  const queryClient = useQueryClient();

  // Get current filters
  const { data: filters = defaultFilters } = useQuery({
    queryKey: ['contentFilters'],
    // Initialize with default filters if none exist
    initialData: defaultFilters,
  });

  // Update filters
  const { mutate: setFilters } = useMutation({
    mutationFn: (newFilters) => {
      return Promise.resolve(newFilters); // Simulate API call
    },
    onSuccess: (newFilters) => {
      queryClient.setQueryData(['contentFilters'], newFilters);
    },
  });

  // Helper function to update a single filter
  const updateFilter = (filterName, value) => {
    if (filters[filterName] === value) return;
    
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  return {
    filters,
    updateFilter,
    setFilters,
  };
}