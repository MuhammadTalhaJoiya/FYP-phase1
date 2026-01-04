import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const Progress = ({ value = 0, className, showLabel = false, max = 100 }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const getColor = (val) => {
    if (val >= 80) return 'bg-green-500';
    if (val >= 60) return 'bg-yellow-500';
    if (val >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      <div className={cn('w-full bg-gray-200 rounded-full h-3 overflow-hidden', className)}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full', getColor(percentage))}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-600 mt-1 text-right">{percentage.toFixed(0)}%</p>
      )}
    </div>
  );
};

