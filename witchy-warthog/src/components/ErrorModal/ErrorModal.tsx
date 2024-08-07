import React from 'react';
import './ErrorModal.css';

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
  return (
    <div className="error-modal-overlay">
      <div className="error-modal">
        <button className="close-button" onClick={onClose}>X</button>
        <img src="https://i.imgur.com/yLSnSMS.png" alt="Error Character" />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorModal;
