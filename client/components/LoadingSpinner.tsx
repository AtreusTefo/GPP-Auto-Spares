import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  text 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <div 
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-gpp-blue',
          sizeClasses[size]
        )}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className={cn(
          'text-gray-600 font-montserrat',
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;