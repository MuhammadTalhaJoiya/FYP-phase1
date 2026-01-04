import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Briefcase, Building2, Calendar, Download, 
  ChevronDown, ChevronUp, Home, Loader2, MessageSquare
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Progress } from '../../components/ui/Progress';
import { OverallScore } from '../../components/phase2/results/OverallScore';
import { StrengthsWeaknesses } from '../../components/phase2/results/StrengthsWeaknesses';
import { Recommendation } from '../../components/phase2/results/Recommendation';
import { mockFetchInterviewResult } from '../../data/interviewDummyData';

const InterviewResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState([]);

  useEffect(() => {
    loadResult();
  }, [id]);

  const loadResult = async () => {
    setLoading(true);
    try {
      const data = await mockFetchInterviewResult(id);
      setResult(data);
    } catch (error) {
      console.error('Failed to load result:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (index) => {
    setExpandedQuestions(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreVariant = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const handleDownloadReport = () => {
    // Placeholder for download functionality
    alert('Download functionality will be implemented with backend integration');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Results not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Interview Results</h1>
              <p className="text-gray-500 mt-1">Completed on {new Date(result.completedAt).toLocaleDateString()}</p>
            </div>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              icon={<Home className="w-5 h-5" />}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Candidate & Job Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="font-semibold text-gray-900">{result.jobRole}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-semibold text-gray-900">{result.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Interview Type</p>
                    <p className="font-semibold text-gray-900 capitalize">{result.interviewType}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Overall Score & Recommendation */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Overall Score */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Overall Performance</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <OverallScore score={result.overallScore} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommendation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>AI Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                <Recommendation 
                  recommendation={result.recommendation}
                  reason={result.recommendationReason}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Strengths & Weaknesses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Analysis</h2>
          <StrengthsWeaknesses 
            strengths={result.strengths}
            weaknesses={result.weaknesses}
          />
        </motion.div>

        {/* Per-Question Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Question-by-Question Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.questionResults.map((qResult, index) => (
                <motion.div
                  key={qResult.questionId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-bold text-gray-600">
                        {index + 1}
                      </span>
                      <span className="text-left font-medium text-gray-900 line-clamp-1">
                        {qResult.questionText}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getScoreVariant(qResult.score)}>
                        {qResult.score}/100
                      </Badge>
                      {expandedQuestions.includes(index) 
                        ? <ChevronUp className="w-5 h-5 text-gray-400" />
                        : <ChevronDown className="w-5 h-5 text-gray-400" />
                      }
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {expandedQuestions.includes(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="border-t border-gray-200 p-4 bg-gray-50 space-y-4"
                    >
                      {/* Transcript */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Your Response
                        </p>
                        <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border">
                          "{qResult.transcript}"
                        </p>
                      </div>

                      {/* Feedback */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">AI Feedback</p>
                        <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded-lg border border-purple-100">
                          {qResult.feedback}
                        </p>
                      </div>

                      {/* Skill Scores */}
                      {qResult.skillScores && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-3">Skill Breakdown</p>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(qResult.skillScores).map(([skill, score]) => (
                              <div key={skill} className="bg-white p-3 rounded-lg border">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600 capitalize">{skill.replace('_', ' ')}</span>
                                  <span className={`font-medium ${getScoreColor(score)}`}>{score}%</span>
                                </div>
                                <Progress value={score} className="h-1.5" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Button
            onClick={handleDownloadReport}
            variant="outline"
            size="lg"
            icon={<Download className="w-5 h-5" />}
          >
            Download Report (PDF)
          </Button>
          <Button
            onClick={() => navigate('/')}
            size="lg"
          >
            Return to Dashboard
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default InterviewResult;

