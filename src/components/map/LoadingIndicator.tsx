
import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading map...</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Please allow location access</p>
      </div>
    </div>
  );
};

export default LoadingIndicator;
