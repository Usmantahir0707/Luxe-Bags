import React from 'react';

/**
 * Simple, reusable loading spinner component
 * Props:
 * - size: 'sm' | 'md' | 'lg' | 'xl' (optional) - Size of the spinner
 * - className: string (optional) - Additional CSS classes
 */
const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-b-2',
    md: 'h-8 w-8 border-b-2',
    lg: 'h-12 w-12 border-b-2',
    xl: 'h-16 w-16 border-b-4'
  };

  return (
    <div className={`animate-spin rounded-full ${sizeClasses[size]} border-(--main-1) ${className}`} />
  );
};

export default LoadingSpinner;
