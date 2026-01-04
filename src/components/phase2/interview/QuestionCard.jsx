import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../ui/Badge';
import { skillCategories, difficultyLevels } from '../../../data/interviewDummyData';

export const QuestionCard = ({ 
  question, 
  index, 
  isActive = false,
  showMetadata = true,
  compact = false 
}) => {
  const skill = skillCategories.find(s => s.id === question.skill);
  const difficulty = difficultyLevels.find(d => d.id === question.difficulty);

  const getDifficultyVariant = (level) => {
    switch (level) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const getSkillVariant = (skillId) => {
    switch (skillId) {
      case 'communication': return 'info';
      case 'technical': return 'primary';
      case 'problem_solving': return 'warning';
      case 'leadership': return 'error';
      case 'teamwork': return 'success';
      default: return 'default';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-xl border-2 transition-all
        ${isActive 
          ? 'border-primary-500 bg-primary-50 shadow-lg' 
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
        ${compact ? 'p-4' : 'p-6'}
      `}
    >
      {/* Question Number */}
      {index !== undefined && (
        <div className="flex items-center gap-3 mb-3">
          <span className={`
            flex items-center justify-center rounded-full font-bold text-sm
            ${isActive ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}
            ${compact ? 'w-6 h-6' : 'w-8 h-8'}
          `}>
            {index + 1}
          </span>
          {showMetadata && (
            <div className="flex items-center gap-2 flex-wrap">
              {skill && (
                <Badge variant={getSkillVariant(skill.id)} className="text-xs">
                  {skill.label}
                </Badge>
              )}
              {difficulty && (
                <Badge variant={getDifficultyVariant(difficulty.id)} className="text-xs">
                  {difficulty.label}
                </Badge>
              )}
            </div>
          )}
        </div>
      )}

      {/* Question Text */}
      <p className={`text-gray-900 leading-relaxed ${compact ? 'text-sm' : 'text-lg'}`}>
        {question.text}
      </p>

      {/* Time Limit */}
      {showMetadata && question.timeLimit && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{question.timeLimit} seconds to answer</span>
        </div>
      )}
    </motion.div>
  );
};

export default QuestionCard;

