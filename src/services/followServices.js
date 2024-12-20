import supabase from "@utility/SupabaseClient";

// Toggle follow for a feed based on username
export const toggleFollowFeed = async (user_id, username) => {
  if (!user_id) throw new Error("User not authenticated");
  if (!username) throw new Error("Username not provided");
  const feed_id = await usernameToUserId(username);
  const alreadyFollowing = await isFollowingFeed(user_id, feed_id);

  if (alreadyFollowing) {
    // Unfollow (delete the record)
    const { error: deleteError } = await supabase
      .from("user_feed_follow")
      .delete()
      .eq("user_id", user_id)
      .eq("feed_id", feed_id);
    if (deleteError) throw new Error(deleteError.message);

    // Decrement the follows count
    const { data, error: getError } = await supabase
      .from("user_profile")
      .select("follows")
      .eq("user_id", feed_id)
      .single();
    if (getError) throw new Error(getError.message);

    const newFollowsCount = data.follows - 1;
    const { error: updateError } = await supabase
      .from("user_profile")
      .update({ follows: newFollowsCount })
      .eq("user_id", feed_id);
    if (updateError) throw new Error(updateError.message);

    return "Successfully unfollowed the feed";
  } else {
    // Follow (insert a new record)
    const { error: insertError } = await supabase
      .from("user_feed_follow")
      .insert([{ user_id, feed_id }]);
    if (insertError) throw new Error(insertError.message);

    // Increment the follows count
    const { data, error: getError } = await supabase
      .from("user_profile")
      .select("follows")
      .eq("user_id", feed_id)
      .single();
    if (getError) throw new Error(getError.message);

    const newFollowsCount = data.follows + 1;
    const { error: updateError } = await supabase
      .from("user_profile")
      .update({ follows: newFollowsCount })
      .eq("user_id", feed_id);
    if (updateError) throw new Error(updateError.message);

    return "Successfully followed the feed";
  }
};

// Toggle follow for a source based on source name
export const toggleFollowSource = async (user_id, source_id) => {
  if (!user_id) throw new Error("User not authenticated");

  const alreadyFollowingSource = await isFollowingSource(user_id, source_id);
  if (alreadyFollowingSource) {
    // Unfollow (delete the record)
    const { error: deleteError } = await supabase
      .from("user_source_follow")
      .delete()
      .eq("user_id", user_id)
      .eq("source_id", source_id);
    if (deleteError) throw new Error(deleteError.message);

    return "Successfully unfollowed the source";
  } else {
    // Follow (insert a new record)
    const { error: insertError } = await supabase
      .from("user_source_follow")
      .insert([{ user_id, source_id}]);
    if (insertError) throw new Error(insertError.message);

    return "Successfully followed the source";
  }
};

// Utility functions
export const usernameToUserId = async (username) => {
  const { data, error } = await supabase
    .from("user_profile")
    .select("user_id")
    .eq("username", username)
    .single();
  if (error)
    throw new Error("Error locating user_id from username: " + error.message);

  return data.user_id;
};

export const isFollowingFeed = async (user_id, feed_id) => {
  const { data, error } = await supabase
    .from("user_feed_follow")
    .select("*")
    .eq("user_id", user_id)
    .eq("feed_id", feed_id);
  if (error) throw new Error("Error checking follow status: " + error.message);

  return data.length > 0;
};

export const isFollowingSource = async (user_id, source_id) => {
  const { data, error } = await supabase
    .from("user_source_follow")
    .select("*")
    .eq("user_id", user_id)
    .eq("source_id", source_id);
  if (error) throw new Error("Error checking follow status: " + error.message);

  return data.length > 0;
};
