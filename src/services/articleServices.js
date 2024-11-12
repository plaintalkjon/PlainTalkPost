// src/services/articlesService.js
import supabase from '../utility/SupabaseClient';

export const fetchArticles = async (filters) => {
// Example using `sources!inner` for an inner join and ensuring all filters are scoped correctly
let query = supabase.from('content')
  .select(`
    title,
    link,
    description,
    datetime,
    content_id,
    category,
    upvotes,
    sources_id,
    media_type,
    sources!inner (
      name,
      channel_id,
      politicalbias,
      publicationtype
    )
  `);

// Apply filters
if (filters.category) {
  query = query.eq('category', filters.category);
}
if (filters.mediaType) {
  query = query.eq('media_type', filters.mediaType);
}
// Ensure that filters on `sources` use the correct table alias
if (filters.bias) {
  query = query.eq('sources.politicalbias', filters.bias);
}
if (filters.publication) {
  query = query.eq('sources.publicationtype', filters.publication);
}

if (filters.sources && filters.sources.length > 0) {
  query = query.in("sources_id", filters.sources); // Use sources_id and pass an array
}

if (filters.bumps && filters.bumps.length > 0) {
  query = query.in("content_id", filters.bumps); // Pass bumps array directly
}

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  query = query.gte("datetime", oneDayAgo);
  // Sorting
  const sortColumn = filters.sort === 'latest' ? 'datetime' : 'upvotes';
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
