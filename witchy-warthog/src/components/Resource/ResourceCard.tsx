import React from 'react';

interface ResourceCardProps {
  card: {
    id: string;
    gather: { [key: string]: number };
    increase: { [key: string]: number };
  };
  selected: boolean;
  onSelect: () => void;
  selectedResources: string[];
  onResourceSelect: (resource: string) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ card, selected, onSelect, selectedResources, onResourceSelect }) => {
  const resourceIcons: { [key: string]: string } = {
    mandrake: "https://i.imgur.com/OBRVBHq.png",
    nightshade: "https://i.imgur.com/IE7UC04.png",
    foxglove: "https://i.imgur.com/Wm2Qha4.png",
    toadstool: "https://i.imgur.com/eQyoGQP.png",
    horn: "https://i.imgur.com/1zn1W9K.png",
  };

  return (
    <div className={`resource-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="gather-section">
        <b>Gather Reagents</b>
        <div className="resources">
          {Object.entries(card.gather).filter(([_, amount]) => amount > 0).map(([resource, amount]) => (
            <div key={resource} className={`resource ${selectedResources.includes(resource) ? 'selected' : ''}`} onClick={(e) => {
              e.stopPropagation();
              onResourceSelect(resource);
            }}>
              <img src={resourceIcons[resource]} alt={resource} />
              <span>{amount}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="increase-section">
        <b>Increase Value</b>
        <div className="resources">
          {Object.entries(card.increase).filter(([_, amount]) => amount > 0).map(([resource, amount]) => (
            <div key={resource} className="resource">
              <img src={resourceIcons[resource]} alt={resource} />
              <span>{amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
