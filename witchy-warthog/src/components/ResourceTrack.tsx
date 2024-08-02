import React from 'react';

interface ResourceTrackProps {
  resource: string;
  amount: number;
  iconUrl: string;
}

const ResourceTrack: React.FC<ResourceTrackProps> = ({ resource, amount, iconUrl }) => {
  return (
    <div className="resource-track">
      <img src={iconUrl} alt={`${resource} icon`} className="resource-icon" />
      <span>{resource}: {amount}</span>
    </div>
  );
};

export default ResourceTrack;
