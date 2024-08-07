import React from 'react';
import './ErrorModal.css';

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

const OhnoModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
  return (
    <div className="error-modal-overlay">
      <div className="error-modal">
        <img src="https://i.imgur.com/1sk4dDI.png" alt="Oh No Character" />
        <p>{message}</p>
        <button className="ok-button" onClick={onClose}>Exit Dungeon</button>
      </div>
    </div>
  );
};

export default OhnoModal;
