import React from 'react';
import { Construction, Clock } from 'lucide-react';

const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 p-8 bg-gray-100 rounded-lg shadow-md">
      <div className="mb-6 text-amber-500">
        <Construction size={64} />
      </div>
      
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Coming Soon</h2>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        We&apos;re working hard to bring you this feature. Please check back later.
      </p>
      
      <div className="flex items-center text-gray-500 mb-4">
        <Clock className="mr-2" size={20} />
        <span>Under Construction</span>
      </div>
    </div>
  );
};

export default ComingSoon;
