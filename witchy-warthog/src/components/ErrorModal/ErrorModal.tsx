import React from 'react';
import './ErrorModal.css';

interface ErrorModalProps {
  errorMessage: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ errorMessage, onClose }) => {
  return (
    <div className="error-modal-container">
      <div className="error-modal">
        <img src="https://i.imgur.com/yLSnSMS.png" alt="Error character" className="error-character" />
        <div className="error-content">
          <h3>Error</h3>
          <p>{errorMessage}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
