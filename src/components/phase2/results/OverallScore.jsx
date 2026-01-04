import React from 'react';
import { motion } from 'framer-motion';

export const OverallScore = ({ 
  score, 
  size = 'lg',
  showLabel = true,
  animated = true 
}) => {
  const radius = size === 'lg' ? 80 : size === 'md' ? 60 : 45;
  const strokeWidth = size === 'lg' ? 12 : size === 'md' ? 10 : 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - score / 100);

  const getScoreColor = () => {
    if (score >= 80) return { stroke: '#10b981', bg: '#d1fae5', text: '#059669' };
    if (score >= 60) return { stroke: '#f59e0b', bg: '#fef3c7', text: '#d97706' };
    return { stroke: '#ef4444', bg: '#fee2e2', text: '#dc2626' };
  };

  const colors = getScoreColor();
  const containerSize = (radius + strokeWidth) * 2;

  const getLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Average';
    return 'Needs Improvement';
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative"
        style={{ width: containerSize, height: containerSize }}
      >
        <svg
          width={containerSize}
          height={containerSize}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Score arc */}
          <motion.circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
          />
        </svg>
        
        {/* Score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className={`font-bold tabular-nums ${
              size === 'lg' ? 'text-5xl' : size === 'md' ? 'text-4xl' : 'text-2xl'
            }`}
            style={{ color: colors.text }}
            initial={animated ? { opacity: 0, scale: 0.5 } : {}}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className={`text-gray-400 ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>
            out of 100
          </span>
        </div>
      </div>
      
      {showLabel && (
        <motion.div
          initial={animated ? { opacity: 0, y: 10 } : {}}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`mt-4 px-4 py-2 rounded-full text-sm font-medium`}
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {getLabel()}
        </motion.div>
      )}
    </div>
  );
};

export default OverallScore;

