import React from 'react';

const RecentlySearched = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center p-8">
        <h1 className="text-4xl lg:text-6xl font-bold mb-4">We're Working on It!</h1>
        <p className="text-lg lg:text-2xl mb-6">
          This section is currently under construction. Please check back later for updates.
        </p>
        <div className="flex justify-center mt-4">
          <div className="animate-pulse bg-teal-800 w-16 h-16 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default RecentlySearched;