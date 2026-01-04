import React from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, MinusCircle, ThumbsDown, Sparkles } from 'lucide-react';

const recommendationConfig = {
  shortlist: {
    icon: ThumbsUp,
    label: 'Shortlist',
    description: 'Recommended for next round',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    textColor: 'text-green-700',
    iconColor: 'text-green-600',
  },
  consider: {
    icon: MinusCircle,
    label: 'Consider',
    description: 'Potential fit, requires further review',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-700',
    iconColor: 'text-amber-600',
  },
  reject: {
    icon: ThumbsDown,
    label: 'Not Recommended',
    description: 'Does not meet requirements',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    textColor: 'text-red-700',
    iconColor: 'text-red-600',
  },
};

export const Recommendation = ({ 
  recommendation = 'consider', 
  reason,
  animated = true 
}) => {
  const config = recommendationConfig[recommendation] || recommendationConfig.consider;
  const Icon = config.icon;

  return (
    <motion.div
      initial={animated ? { opacity: 0, scale: 0.9 } : {}}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`
        rounded-2xl border-2 p-6
        ${config.bgColor} ${config.borderColor}
      `}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <motion.div
          initial={animated ? { rotate: -20, scale: 0 } : {}}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className={`
            flex items-center justify-center w-14 h-14 rounded-xl
            bg-white shadow-sm
          `}
        >
          <Icon className={`w-8 h-8 ${config.iconColor}`} />
        </motion.div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-xl font-bold ${config.textColor}`}>
              {config.label}
            </h3>
            <Sparkles className={`w-5 h-5 ${config.iconColor}`} />
          </div>
          <p className={`text-sm ${config.textColor} opacity-80`}>
            {config.description}
          </p>
          
          {reason && (
            <motion.div
              initial={animated ? { opacity: 0, y: 10 } : {}}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4 p-4 bg-white/70 rounded-xl"
            >
              <p className="text-sm font-medium text-gray-700 mb-1">AI Assessment</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {reason}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Recommendation;

