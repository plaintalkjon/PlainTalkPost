import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@contexts/AuthContext";
import { useContentOperations } from "@hooks/useContentOperations";
import FilterContentButton from "@components/atoms/buttons/FilterContentButton/FilterContentButton";
import Loading from "@components/Loading/Loading";
import supabase from "@utility/SupabaseClient";
import "./AllSources.css";

const AllSources = () => {
  const { user, userData } = useAuth();
  const { followSource } = useContentOperations();
  const [biasFilter, setBiasFilter] = useState(null);
  const [publicationType, setPublicationType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: sources, isLoading, isError } = useQuery({
    queryKey: ['source'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('source')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const handleFollowSource = (sourceId) => {
    if (!user) return;
    followSource.mutate({ userId: user.id, sourceId });
  };

  const filteredSources = sources?.filter(source => {
    const matchesBias = !biasFilter || source.political_bias === biasFilter;
    const matchesType = !publicationType || source.publication_type === publicationType;
    const matchesSearch = !searchTerm || 
      source.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBias && matchesType && matchesSearch;
  });

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading sources</div>;

  return (
    <div className="all-sources-container">
      <h2>All Sources</h2>
      
      <div className="sources-filters">
        <input
          type="text"
          placeholder="Search sources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="source-search"
        />
        
        <div className="filter-section">
          <h3>Political Bias</h3>
          <div className="bias-filters">
            <FilterContentButton
              id="bias-filter-all"
              onClick={() => setBiasFilter(null)}
              isActive={!biasFilter}
              className="all"
            >
              All Bias
            </FilterContentButton>
            {['left', 'leanleft', 'center', 'leanright', 'right'].map((bias) => (
              <FilterContentButton
                key={bias}
                onClick={() => setBiasFilter(biasFilter === bias ? null : bias)}
                isActive={biasFilter === bias}
                className={bias}
              >
                {bias.charAt(0).toUpperCase() + bias.slice(1)}
              </FilterContentButton>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Publication Type</h3>
          <div className="publication-filters">
            <FilterContentButton
              id="publication-filter-all"
              onClick={() => setPublicationType(null)}
              isActive={!publicationType}
              className="all"
            >
              All Types
            </FilterContentButton>
            <FilterContentButton
              id="publication-filter-mainstream"
              onClick={() => setPublicationType(publicationType === 'Mainstream' ? null : 'Mainstream')}
              isActive={publicationType === 'Mainstream'}
              className="mainstream"
            >
              Mainstream
            </FilterContentButton>
            <FilterContentButton
              id="publication-filter-indie"
              onClick={() => setPublicationType(publicationType === 'Indie' ? null : 'Indie')}
              isActive={publicationType === 'Indie'}
              className="indie"
            >
              Indie
            </FilterContentButton>
          </div>
        </div>
      </div>

      <div className="sources-grid">
        {filteredSources?.map((source) => (
          <div key={source.source_id} className={`source-card ${source.political_bias}`}>
            <h3>{source.name}</h3>
            <p className="source-description">{source.description}</p>
            {user && (
              <img
                className={`tidbits-follow-img ${userData?.sources?.includes(source.source_id) ? "clicked" : ""}`}
                src={`/img/${userData?.sources?.includes(source.source_id) 
                  ? "following-source-img.svg" 
                  : "follow-source-img.svg"}`}
                alt={userData?.sources?.includes(source.source_id) 
                  ? "unfollow source" 
                  : "follow source"}
                onClick={() => handleFollowSource(source.source_id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllSources;
