import React from 'react';

const ForeclosureSkeleton = () => (
  <div className="w-full px-6">
    <div className="w-1/2 h-20 bg-gray-200 animate-pulse rounded mb-4" />
    
    <div className="mb-8 w-full">
      <div className="w-3/4 h-6 bg-gray-200 animate-pulse rounded mb-2" />
      <div className="w-1/2 h-4 bg-gray-200 animate-pulse rounded mb-2" />
      <div className="w-2/3 h-4 bg-gray-200 animate-pulse rounded" />
    </div>

    <div className="flex gap-4 mb-6 w-full">
      <div className="flex-1 h-10 bg-gray-200 animate-pulse rounded" />
      <div className="w-24 h-10 bg-gray-200 animate-pulse rounded" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 animate-pulse rounded w-full" />
      ))}
    </div>

    <div className="mt-6 space-y-4 w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-6 gap-4 w-full">
            {[...Array(6)].map((_, j) => (
              <div key={j} className="h-8 bg-gray-200 animate-pulse rounded w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ForeclosureSkeleton;