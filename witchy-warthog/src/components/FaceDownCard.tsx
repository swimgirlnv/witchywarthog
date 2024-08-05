import React from 'react';

interface FaceDownCardProps {
  imageUrl: string;
}

const FaceDownCard: React.FC<FaceDownCardProps> = ({ imageUrl }) => {
  return (
    <div className="face-down-card">
      <img src={imageUrl} alt="Face Down Card" className="face-down-card-image" />
    </div>
  );
};

export default FaceDownCard;
