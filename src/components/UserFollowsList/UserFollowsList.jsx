import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import UserCard from "@components/UserCard/UserCard";
import Loading from "@components/Loading/Loading";
import supabase from "@utility/SupabaseClient";
import "./UserFollowsList.css";
import { DataRedundancy } from "@aws-sdk/client-s3";

const UserFollowsList = ({ profileUserId }) => {
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["userFollows", profileUserId],
      queryFn: async ({ pageParam = 0 }) => {
        const { data, error } = await supabase
          .from("user_feed_follow")
          .select(
            `
          feed_id,
          user_profile!inner(
            username,
            profile_picture
          )
        `
          )
          .eq("user_id", profileUserId)
          .range(pageParam, pageParam + 19)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Query error:", error);
          throw error;
        }
        return data;
      },
      getNextPageParam: (lastPage, allPages) => {
        return lastPage?.length === 20 ? allPages.length * 20 : undefined;
      },
    });

  // Load more when scrolled to bottom
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);


  return (
    <div className="follows-list-container">
      <h4 className="following-header">Following</h4>
      <div className="follows-list">
        {isLoading ? (
          <Loading />
        ) : data?.pages[0]?.length > 0 ? (
          data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.map((follow) => (
                <div key={follow.feed_id} className="follow-item">
                  <UserCard
                    username={follow.user_profile.username}
                    profilePicture={follow.user_profile.profile_picture}
                    userId={follow.feed_id}
                    cardType="recommended"
                  />
                </div>
              ))}
            </React.Fragment>
          ))
        ) : (
          <p className="no-follows">Not following anyone yet.</p>
        )}
        {/* Intersection Observer target */}
        {data?.pages[0]?.length > 0 && (
          <div ref={ref} className="load-more">
            {isFetchingNextPage && <Loading />}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserFollowsList;
