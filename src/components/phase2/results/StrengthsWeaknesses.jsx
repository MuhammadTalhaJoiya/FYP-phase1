import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';

export const StrengthsWeaknesses = ({ strengths = [], weaknesses = [] }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Strengths */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <TrendingUp className="w-5 h-5" />
            Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.ul
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {strengths.map((strength, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{strength}</span>
              </motion.li>
            ))}
          </motion.ul>
          {strengths.length === 0 && (
            <p className="text-gray-500 text-sm italic">No strengths identified yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Weaknesses / Areas for Improvement */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700">
            <TrendingDown className="w-5 h-5" />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.ul
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {weaknesses.map((weakness, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                className="flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{weakness}</span>
              </motion.li>
            ))}
          </motion.ul>
          {weaknesses.length === 0 && (
            <p className="text-gray-500 text-sm italic">No areas for improvement identified.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StrengthsWeaknesses;

