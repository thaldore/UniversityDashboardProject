import React from 'react';

const LoadingSpinner = ({ message = 'Yükleniyor...', size = 'default' }) => {
  const sizeClass = size === 'small' ? 'loading-small' : size === 'large' ? 'loading-large' : '';
  
  return (
    <div className={`loading-container ${sizeClass}`}>
      <div className="spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
