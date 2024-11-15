// src/services/articlesService.js
import supabase from '../utility/SupabaseClient';

export const fetchArticles = async (filters) => {

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

if (filters.sources.length > 0) {
  query = query.in("sources_id", filters.sources);
}

if (filters.loadedContentIds && filters.loadedContentIds.length > 0) {
  query = query.not('content_id', 'in', `(${filters.loadedContentIds})`);
}

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  query = query.gte("datetime", oneDayAgo);
  // Sorting
  const sortColumn = filters.sort === 'latest' ? 'datetime' : 'upvotes';
  query = query.order(sortColumn, { ascending: false });

  // Sets limit to 10 articles
  query = query.limit(20);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return data;
};
