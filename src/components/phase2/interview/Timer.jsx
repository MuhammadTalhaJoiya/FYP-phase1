import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export const Timer = ({ 
  duration = 120, 
  isRunning = false, 
  onComplete,
  size = 'md',
  showLabel = true 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    setTimeLeft(duration);
    setIsExpired(false);
  }, [duration]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const progress = (timeLeft / duration) * 100;
  const radius = size === 'lg' ? 70 : size === 'md' ? 50 : 35;
  const strokeWidth = size === 'lg' ? 8 : size === 'md' ? 6 : 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  const getColor = () => {
    if (progress > 50) return '#10b981'; // green
    if (progress > 25) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const containerSize = (radius + strokeWidth) * 2;

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
          {/* Progress circle */}
          <motion.circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={getColor()}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </svg>
        
        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            className={`font-bold tabular-nums ${
              size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-lg'
            } ${isExpired ? 'text-red-500' : 'text-gray-900'}`}
            animate={isExpired ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: isExpired ? Infinity : 0, duration: 0.5 }}
          >
            {formatTime(timeLeft)}
          </motion.span>
        </div>
      </div>
      
      {showLabel && (
        <p className={`mt-2 text-sm ${isExpired ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
          {isExpired ? 'Time\'s up!' : 'Time Remaining'}
        </p>
      )}
    </div>
  );
};

export default Timer;

