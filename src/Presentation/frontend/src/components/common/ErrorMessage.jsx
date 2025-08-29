import React from 'react';

const ErrorMessage = ({ message, onClose, type = 'error' }) => {
  const containerClass = type === 'success' ? 'success-container' : 'error-container';
  
  return (
    <div className={containerClass}>
      <div className={`${type}-message`}>
        <span className={`${type}-icon`}>
          {type === 'error' ? '⚠️' : '✅'}
        </span>
        <span>{message}</span>
      </div>
      {onClose && (
        <button 
          onClick={onClose} 
          className={`${type}-close`}
          aria-label="Kapat"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
