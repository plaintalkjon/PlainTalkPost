import supabase from '../utility/SupabaseClient.js';

export const fetchSourceIdBySourceName = async (sourceName) => {
  const { data, error: getSourceError  } = await supabase
  .from("sources")
  .select("sources_id")
  .eq("name", sourceName)
  .single();

  if (getSourceError) {
    throw new Error("Error getting source id");
  }

  return data.sources_id;
}

export async function fetchFeedsByUserId(userId) {
  try {
    const { data: rows, error } = await supabase
      .from("users_feeds")
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

export async function fetchBumpedFeedByFeedArray(feedArray) {
  try {
    const { data: rows, error } = await supabase
      .from("users_bumps")
      .select("content_id") // Ensure 'content_id' matches your table schema
      .in("user_id", feedArray); // Pass feedArray directly as an array

    if (error) {
      console.error("Error fetching bumped feed:", error);
      throw new Error("Unable to fetch bumped feed");
    }
    if (rows){
    return rows.map((row) => row.content_id);}
    else {
      return [];
    } // Return an array of content IDs
  } catch (error) {
    console.error("Error in fetchBumpedFeedByFeedArray:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
}


export const fetchRecommendedFeedsByUserIdAndFollowedFeeds = async (userId = null, followedFeeds = []) => {
  try {


    const { data, error } = await supabase
      .from('users_extended')
      .select('username, profile_picture')
      .not('user_id', 'in', `(${followedFeeds.join(',')})`) // Exclude followedFeeds
      .neq('user_id', userId) // Exclude followedFeeds
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



export async function fetchUpvotesByUserId(userId) {
  try {
    const { data: rows, error } = await supabase
      .from("users_upvotes")
      .select("content_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user upvotes:", error);
      throw new Error("Unable to fetch user upvotes");
    }

    return rows.map((row) => row.content_id); // Return an array of content IDs the user has liked
  } catch (error) {
    console.error("Error in fetchUpvotesByUserId:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
}

export async function fetchSourcesByUserId(userId) {
  try {
    const { data: rows, error } = await supabase
      .from("users_sources")
      .select("sources_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user sources:", error);
      throw new Error("Unable to fetch user sources");
    }

    return rows.map((row) => row.sources_id); // Return an array of sources IDs the user follows
  } catch (error) {
    console.error("Error in fetchSourcesByUserId:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
}

export async function fetchBumpsByUserId(userId) {
  try {
    const { data: rows, error } = await supabase
      .from("users_bumps")
      .select("content_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user bumps:", error);
      throw new Error("Unable to fetch user bumps");
    }

    return rows.map((row) => row.content_id); // Return an array of content IDs the user has liked
  } catch (error) {
    console.error("Error in fetchBumpsByUserId:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
}

export const fetchUsernameAndProfilePictureByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users_extended')
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
      .from('users_extended')
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
    .from("users_upvotes")
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
      .from("users_upvotes")
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
    .from("users_upvotes")
    .insert([{ user_id: userId, content_id: content_id, timestamp: new Date() }]);

  if (insertError) {
    console.error("Error adding vote:", insertError);
    throw new Error("Error adding vote");
  }

  // Increment upvotes count
  const newUpvotesCount = await updateUpvotesCount(content_id, 1);
  return { success: true, message: "Vote added, upvotes incremented", upvotes: newUpvotesCount };
};

// Function to toggle bump on content
export const bumpContent = async (userId, content_id) => {
  if (!userId) throw new Error("Unauthorized: No user logged in");

  // Check if the user has already bumped this content
  const { data: existingBump, error: existingBumpError } = await supabase
    .from("users_bumps")
    .select("*")
    .eq("user_id", userId)
    .eq("content_id", content_id)
    .single();

  if (existingBumpError && existingBumpError.code !== "PGRST116") {
    // Only allow "not found" errors to proceed
    console.error("Error checking bump status:", existingBumpError);
    throw new Error("Error checking bump status");
  }

  if (existingBump) {
    // If a bump exists, remove it
    const { error: deleteError } = await supabase
      .from("users_bumps")
      .delete()
      .eq("user_id", userId)
      .eq("content_id", content_id);

    if (deleteError) {
      console.error("Error removing bump:", deleteError);
      throw new Error("Error removing bump");
    }

    return { success: true, message: "Bump removed" };
  }

  // Add a new bump
  const { error: insertError } = await supabase
    .from("users_bumps")
    .insert([{ user_id: userId, content_id: content_id }]);

  if (insertError) {
    console.error("Error adding bump:", insertError);
    throw new Error("Error adding bump");
  }

  return { success: true, message: "Bump added" };
};
