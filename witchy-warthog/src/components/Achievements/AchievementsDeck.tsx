import React from 'react';
import './Achievements.css';
import { Achievement } from './achievementsData';

interface AchievementsDeckProps {
  achievements: Achievement[];
}

const AchievementsDeck: React.FC<AchievementsDeckProps> = ({ achievements }) => {
  return (
    <div className="achievements-deck">
      <div className="achievements-grid">
        {achievements.map(a => (
          <div key={a.id} className="achievement-tile">
            <div className="ach-title">{a.title}</div>
            <div className="ach-desc">{a.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsDeck;
