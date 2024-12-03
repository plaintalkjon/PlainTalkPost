import supabase from '@utility/SupabaseClient.js';

export const fetchSourceIdBySourceName = async (sourceName) => {
  const { data, error: getSourceError  } = await supabase
  .from("source")
  .select("source_id")
  .eq("name", sourceName)
  .single();

  if (getSourceError) {
    throw new Error("Error getting source id");
  }

  return data.source_id;
}

export async function fetchFeedsByUserId(userId) {
  try {
    const { data: rows, error } = await supabase
      .from("user_feed_follow")
      .select("feed_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user feeds:", error);
      throw new Error("Unable to fetch user feeds");
    }

    return rows.map((row) => row.feed_id); // Return an array of feed IDs
  } catch (error) {
    console.error("Error in fetchFeedsByUserId:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
}

export const fetchRecommendedFeedsByUserIdAndFollowedFeeds = async (userId = null, followedFeeds = []) => {
  try {
    let query = supabase
      .from('user_profile')
      .select('username, profile_picture')
      .order('follows', { ascending: false })
      .limit(10);

    // Only apply exclusion filters if we have a logged-in user
    if (userId) {
      query = query
        .neq('user_id', userId);
    }

    if (followedFeeds.length > 0) {
      query = query
        .not('user_id', 'in', `(${followedFeeds.join(',')})`)
    }

    const { data, error } = await query;

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



export async function fetchUpvotesByUserId(userId) {
  const { data: rows, error } = await supabase
    .from("user_content_upvote")
    .select("content_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user upvotes:", error);
    throw error;
  }

  return rows.map((row) => row.content_id);
}

export async function fetchSourcesByUserId(userId) {
  const { data: rows, error } = await supabase
    .from("user_source_follow")
    .select("source_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user sources:", error);
    throw error;
  }

  return rows.map((row) => row.source_id);
}

export const fetchUsernameAndProfilePictureByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_profile')
      .select('username, profile_picture')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetchUsernameAndProfilePictureByUserId:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
};

export const fetchUserIdAndProfilePictureByUsername = async (username) => {
  try {
    const { data, error } = await supabase
      .from('user_profile')
      .select('user_id,profile_picture')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Error fetchProfilePictureByUsername:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
};


// Helper function to update upvotes count in content table
const updateUpvotesCount = async (content_id, increment) => {
  const { data: content, error: getContentError } = await supabase
    .from("content")
    .select("upvotes")
    .eq("content_id", content_id)
    .single();

  if (getContentError) {
    throw new Error("Error fetching content upvotes count");
  }

  const newUpvotesCount = content.upvotes + increment;

  const { error: updateError } = await supabase
    .from("content")
    .update({ upvotes: newUpvotesCount })
    .eq("content_id", content_id);

  if (updateError) {
    throw new Error("Error updating upvotes count");
  }

  return newUpvotesCount;
};

// Function to toggle upvote on content
export const upvoteContent = async (userId, content_id) => {
  if (!userId) throw new Error("Unauthorized: No user logged in");

  // Check if the user has already upvoted this content
  const { data: existingVote, error: existingVoteError } = await supabase
    .from("user_content_upvote")
    .select("*")
    .eq("user_id", userId)
    .eq("content_id", content_id)
    .single();

  if (existingVoteError && existingVoteError.code !== "PGRST116") {
    // Only allow "not found" errors to proceed
    console.error("Error checking vote status:", existingVoteError);
    throw new Error("Error checking vote status");
  }

  if (existingVote) {
    // If a vote exists, remove it
    const { error: deleteError } = await supabase
      .from("user_content_upvote")
      .delete()
      .eq("user_id", userId)
      .eq("content_id", content_id);

    if (deleteError) {
      console.error("Error removing vote:", deleteError);
      throw new Error("Error removing vote");
    }

    // Decrement upvotes count
    const newUpvotesCount = await updateUpvotesCount(content_id, -1);
    return { success: true, message: "Vote removed, upvotes decremented", upvotes: newUpvotesCount };
  }

  // Add a new vote
  const { error: insertError } = await supabase
    .from("user_content_upvote")
    .insert([{ 
      user_id: userId, 
      content_id: content_id, 
      created_at: new Date() 
    }]);

  if (insertError) {
    console.error("Error adding vote:", insertError);
    throw new Error("Error adding vote");
  }

  // Increment upvotes count
  const newUpvotesCount = await updateUpvotesCount(content_id, 1);
  return { success: true, message: "Vote added, upvotes incremented", upvotes: newUpvotesCount };
};
