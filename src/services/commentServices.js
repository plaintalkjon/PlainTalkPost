import supabase from "@utility/SupabaseClient";

// Fetch comments for a specific content
export const fetchCommentsByContentId = async (contentId) => {
  try {
    const { data, error } = await supabase
      .from('user_content_comments')
      .select(`
        comment_id,
        comment_text,
        created_at,
        user_id,
        user_profile:user_id (
          username,
          profile_picture
        )
      `)
      .eq('content_id', contentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Add a new comment
export const addComment = async (userId, contentId, commentText) => {
  try {
    const { data, error } = await supabase
      .from('user_content_comments')
      .insert([
        {
          user_id: userId,
          content_id: contentId,
          comment_text: commentText
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const fetchComments = async (contentId, userId) => {
  try {
    const { data: followedUsers } = await supabase
      .from('user_feed_follow')
      .select('followed_id')
      .eq('follower_id', userId);
    
    const followedUserIds = followedUsers?.map(follow => follow.followed_id) || [];
    
    // Include the user's own ID in the list of allowed commenters
    const allowedUserIds = [userId, ...followedUserIds];

    const { data: comments, error } = await supabase
      .from('user_content_comments')  // Corrected table name
      .select(`
        *,
        user_profile:user_id (
          username,
          profile_picture
        )
      `)
      .eq('content_id', contentId)
      .in('user_id', allowedUserIds) // Only get comments from followed users and self
      .order('created_at', { ascending: true });

    if (error) throw error;
    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};
