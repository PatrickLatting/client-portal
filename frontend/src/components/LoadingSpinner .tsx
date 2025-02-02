import React from 'react';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full py-8 opacity-0 animate-fadeIn">
    <div className="space-x-3 flex items-center">
      {/* First dot - Purple to Pink gradient */}
      <div 
        className="w-3 h-3 rounded-full animate-bounce shadow-lg bg-gradient-to-r from-purple-500 to-pink-500"
        style={{ 
          animationDelay: '0ms',
          animationDuration: '0.8s'
        }} 
      />
      
      {/* Second dot - Blue to Cyan gradient */}
      <div 
        className="w-3 h-3 rounded-full animate-bounce shadow-lg bg-gradient-to-r from-blue-500 to-cyan-400"
        style={{ 
          animationDelay: '150ms',
          animationDuration: '0.8s'
        }} 
      />
      
      {/* Third dot - Emerald to Teal gradient */}
      <div 
        className="w-3 h-3 rounded-full animate-bounce shadow-lg bg-gradient-to-r from-emerald-500 to-teal-400"
        style={{ 
          animationDelay: '300ms',
          animationDuration: '0.8s'
        }} 
      />
      
      {/* Fourth dot - Orange to Rose gradient */}
      <div 
        className="w-3 h-3 rounded-full animate-bounce shadow-lg bg-gradient-to-r from-orange-500 to-rose-400"
        style={{ 
          animationDelay: '450ms',
          animationDuration: '0.8s'
        }} 
      />
    </div>
  </div>
);

export default LoadingSpinner;