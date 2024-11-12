import supabase from "../utility/SupabaseClient.js";

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
    throw new Error("Error checking vote status");
  }

  // If a vote exists, remove it
  if (existingVote) {
    const { error: deleteError } = await supabase
      .from("users_upvotes")
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
    .from("users_upvotes")
    .insert([
      { user_id: userId, content_id: content_id, timestamp: new Date() },
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
    throw new Error("Error checking bump status");
  }

  // If a bump exists, remove it
  if (existingBump) {
    const { error: deleteError } = await supabase
      .from("users_bumps")
      .delete()
      .eq("user_id", userId)
      .eq("content_id", content_id);

    if (deleteError) {
      throw new Error("Error removing bump");
    }

    return { success: true, message: "Bump removed" };
  }

  // Add a new bump
  const { error: insertError } = await supabase
    .from("users_bumps")
    .insert([{ user_id: userId, content_id: content_id }]);

  if (insertError) {
    throw new Error("Error adding bump");
  }

  return { success: true, message: "Bump added" };
};
