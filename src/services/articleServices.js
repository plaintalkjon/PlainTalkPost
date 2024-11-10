// src/services/articlesService.js
import supabase from '../utility/SupabaseClient.js';

export const fetchArticles = async (filters) => {
  // Construct the query with a join to the `sources` table
  let query = supabase.from('content')
    .select(`
      title,
      link,
      description,
      datetime,
      content_id,
      category,
      likes,
      sources_id,
      media_type,
      sources!sources_id (
        name,
        channel_id,
        politicalbias,
        publicationtype
      )
    `);

  // Apply filters
  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  if (filters.mediaType && filters.mediaType !== 'all') {
    query = query.eq('media_type', filters.mediaType);
  }
  if (filters.bias && filters.bias !== 'all') {
    query = query.eq('sources.politicalbias', filters.bias);
  }
  if (filters.publication && filters.publication !== 'all') {
    query = query.eq('sources.publicationtype', filters.publication);
  }
  
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  query = query.gte("datetime", oneDayAgo);

  // Sorting
  const sortColumn = filters.sort === 'latest' ? 'datetime' : 'likes';
  query = query.order(sortColumn, { ascending: false });

  // Limit the number of articles fetched
  query = query.limit(10);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return data;
};
