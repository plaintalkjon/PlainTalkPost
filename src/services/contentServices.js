import supabase from "@utility/SupabaseClient";

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
    throw new Error("Error checking vote status");
  }

  // If a vote exists, remove it
  if (existingVote) {
    const { error: deleteError } = await supabase
      .from("user_content_upvote")
      .delete()
      .eq("user_id", userId)
      .eq("content_id", content_id);

    if (deleteError) {
      throw new Error("Error removing vote");
    }

    // Decrement upvotes count
    const newUpvotesCount = await updateUpvotesCount(content_id, -1);
    return {
      success: true,
      message: "Vote removed, upvotes decremented",
      upvotes: newUpvotesCount,
    };
  }

  // Add a new vote
  const { error: insertError } = await supabase
    .from("user_content_upvote")
    .insert([
      { user_id: userId, content_id: content_id, created_at: new Date() },
    ]);

  if (insertError) {
    throw new Error("Error adding vote");
  }

  // Increment upvotes count
  const newUpvotesCount = await updateUpvotesCount(content_id, 1);
  return {
    success: true,
    message: "Vote added, upvotes incremented",
    upvotes: newUpvotesCount,
  };
};

export const fetchContent = async (filters) => {
  let query = supabase.from("content").select(`
    title,
    link,
    datetime,
    description,
    content_id,
    category,
    upvotes,
    source_id,
    media_type,
    source!inner (
      name,
      channel_id,
      political_bias,
      publication_type
    )
  `);

  let contentIdsWithComments = [];
  if (filters.followedFeeds && filters.followedFeeds?.length > 0) {
    const { data: commentedContent, error: commentError } = await supabase
      .from('user_content_comments')
      .select('content_id')
      .in('user_id', filters.followedFeeds)
      .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ;

    if (commentError) {
      console.error('Error fetching commented content:', commentError);
      throw commentError;
    }

    contentIdsWithComments = commentedContent.map(item => item.content_id);
    
    // If no comments found, return empty array early
    if (contentIdsWithComments.length === 0) {
      return [];
    }
  }

  // Apply filters
  if (filters.category) {
    query = query.eq("category", filters.category);
  }
  if (filters.mediaType) {
    query = query.eq("media_type", filters.mediaType);
  }
  // Ensure that filters on `sources` use the correct table alias
  if (filters.bias) {
    query = query.eq("source.political_bias", filters.bias);
  }
  if (filters.publication) {
    query = query.eq("source.publication_type", filters.publication);
  }

  if (filters.sources && filters.sources.length > 0) {
    query = query.in("source_id", filters.sources);
  }

  if (filters.loadedContentIds && filters.loadedContentIds.length > 0) {
    query = query.not("content_id", "in", `(${filters.loadedContentIds})`);
  }

  if (contentIdsWithComments.length > 0) {
    query = query.in('content_id', contentIdsWithComments);
  }
  
  if (filters.datetime) {
    query = query.gte("datetime", filters.datetime);
  } else {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    query = query.gte("datetime", oneDayAgo);
  }

  // Sorting
  const sortColumn = filters.sort === "latest" ? "datetime" : "upvotes";
  query = query.order(sortColumn, { ascending: false });

  if (filters.limit) {
    query = query.limit(filters.limit);
  } else {
    query = query.limit(20);
  }


  
  const { data, error } = await query;

  if (error) {
    console.error("Error fetching content:", error);
    throw error;  
  }
  return data;
};
