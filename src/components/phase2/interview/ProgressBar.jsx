import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export const ProgressBar = ({ 
  current, 
  total, 
  completedQuestions = [],
  showLabels = true 
}) => {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            Question {current + 1} of {total}
          </span>
          <span className="text-sm font-medium text-primary-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
      )}

      {/* Question indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {Array.from({ length: total }).map((_, index) => {
          const isCompleted = completedQuestions.includes(index);
          const isCurrent = index === current;
          
          return (
            <motion.div
              key={index}
              className={`
                flex items-center justify-center rounded-full transition-all
                ${isCurrent 
                  ? 'w-8 h-8 bg-primary-600 text-white ring-4 ring-primary-200' 
                  : isCompleted 
                    ? 'w-6 h-6 bg-green-500 text-white' 
                    : 'w-6 h-6 bg-gray-200 text-gray-500'
                }
              `}
              initial={{ scale: 0.8 }}
              animate={{ scale: isCurrent ? 1.1 : 1 }}
            >
              {isCompleted ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;

