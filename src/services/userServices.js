// src/services/userService.js
import supabase from '../utility/SupabaseClient.js';

export const userIdToRecommendedFeeds = async (userId = null, followedFeeds = []) => {
  try {
    const { data, error } = await supabase
      .from('users_extended')
      .select('username, profile_picture')
      .order('follows', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching recommended feeds:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
};
