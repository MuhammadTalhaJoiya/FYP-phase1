import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, MessageSquare, TrendingUp, Sparkles } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Progress } from '../../ui/Progress';

export const AnswerFeedback = ({ 
  transcript,
  score,
  feedback,
  skillScores = {},
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center gap-3">
          <motion.div
            className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <div className="text-center">
            <p className="font-medium text-gray-900">Processing your answer...</p>
            <p className="text-sm text-gray-500">AI is analyzing your response</p>
          </div>
        </div>
      </Card>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 space-y-5">
        {/* Header with Score */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="font-medium text-gray-900">Answer Analyzed</span>
          </div>
          <Badge variant={getScoreBadgeVariant(score)} className="text-lg px-4 py-1">
            {score}/100
          </Badge>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MessageSquare className="w-4 h-4" />
              <span>Your Response (Transcript)</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed border border-gray-100">
              "{transcript}"
            </div>
          </div>
        )}

        {/* AI Feedback */}
        {feedback && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>AI Feedback</span>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-sm text-purple-900 leading-relaxed border border-purple-100">
              {feedback}
            </div>
          </div>
        )}

        {/* Skill Scores */}
        {Object.keys(skillScores).length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <TrendingUp className="w-4 h-4" />
              <span>Skill Breakdown</span>
            </div>
            <div className="space-y-3">
              {Object.entries(skillScores).map(([skill, score]) => (
                <div key={skill} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 capitalize">{skill.replace('_', ' ')}</span>
                    <span className={`font-medium ${getScoreColor(score)}`}>{score}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default AnswerFeedback;

