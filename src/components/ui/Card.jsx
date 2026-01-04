import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const Card = ({ children, className, hover = false, ...props }) => {
  const Component = hover ? motion.div : 'div';
  
  return (
    <Component
      {...(hover && {
        whileHover: { y: -4, boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.15)' },
        transition: { duration: 0.2 }
      })}
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-200 p-6',
        hover && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export const CardHeader = ({ children, className }) => (
  <div className={cn('mb-4', className)}>{children}</div>
);

export const CardTitle = ({ children, className }) => (
  <h3 className={cn('text-lg font-semibold text-gray-900', className)}>{children}</h3>
);

export const CardDescription = ({ children, className }) => (
  <p className={cn('text-sm text-gray-600 mt-1', className)}>{children}</p>
);

export const CardContent = ({ children, className }) => (
  <div className={cn(className)}>{children}</div>
);

