import React, { useState, useEffect } from 'react';
import ContentCard from '../ContentCard/ContentCard';
import supabase from '../../utility/SupabaseClient';
import { useUserData } from '../../contexts/UserDataContext';
import './UserCommentedContent.css';
import Loading from '../Loading/Loading';

const UserCommentedContent = ({ profileUserId }) => {
  const { userData } = useUserData();
  const [commentedContent, setCommentedContent] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCommentedContent = async () => {
    try {
      const { data, error } = await supabase
        .from('user_content_comments')
        .select(`
          content_id,
          content:content_id (
            *,
            source:source_id (*)
          )
        `)
        .eq('user_id', profileUserId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Remove duplicates and keep only the most recent comment for each content
      const uniqueContent = data.reduce((acc, current) => {
        if (!acc.find(item => item.content_id === current.content_id)) {
          acc.push(current);
        }
        return acc;
      }, []);

      setCommentedContent(uniqueContent.map(item => item.content));
    } catch (error) {
      console.error('Error fetching commented content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileUserId) {
      fetchCommentedContent();
    }
  }, [profileUserId]);

  if (loading) return <Loading />;

  return (
    <div className="user-commented-content">
      <h2>Recent Comments</h2>
      <div className="commented-content-list">
        {commentedContent.length > 0 ? (
          commentedContent.map((content) => (
            <ContentCard
              key={content.content_id}
              content={content}
              userId={profileUserId}
            />
          ))
        ) : (
          <p>No commented content yet</p>
        )}
      </div>
    </div>
  );
};

export default UserCommentedContent;