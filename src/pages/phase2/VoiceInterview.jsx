import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Volume2, VolumeX, ChevronRight, ChevronLeft, 
  Loader2, CheckCircle, AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Timer } from '../../components/phase2/interview/Timer';
import { QuestionCard } from '../../components/phase2/interview/QuestionCard';
import { AudioRecorder } from '../../components/phase2/interview/AudioRecorder';
import { AnswerFeedback } from '../../components/phase2/interview/AnswerFeedback';
import { ProgressBar } from '../../components/phase2/interview/ProgressBar';
import { mockFetchInterview, mockSubmitAnswer } from '../../data/interviewDummyData';

// Interview states
const STATES = {
  LOADING: 'loading',
  READY: 'ready',
  PLAYING_QUESTION: 'playing_question',
  RECORDING: 'recording',
  PROCESSING: 'processing',
  FEEDBACK: 'feedback',
  COMPLETED: 'completed',
};

const VoiceInterview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewState, setInterviewState] = useState(STATES.LOADING);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentFeedback, setCurrentFeedback] = useState(null);

  useEffect(() => {
    loadInterview();
  }, [id]);

  const loadInterview = async () => {
    try {
      const data = await mockFetchInterview(id);
      setInterview(data);
      setInterviewState(STATES.READY);
    } catch (error) {
      console.error('Failed to load interview:', error);
    }
  };

  const currentQuestion = interview?.questions[currentQuestionIndex];

  const handlePlayQuestion = () => {
    setInterviewState(STATES.PLAYING_QUESTION);
    // Simulate TTS playing the question
    setTimeout(() => {
      setInterviewState(STATES.READY);
    }, 2000);
  };

  const handleStartRecording = () => {
    setInterviewState(STATES.RECORDING);
    setIsTimerRunning(true);
  };

  const handleStopRecording = async () => {
    setInterviewState(STATES.PROCESSING);
    setIsTimerRunning(false);

    try {
      // Simulate processing the answer
      const feedback = await mockSubmitAnswer(currentQuestion.id, null);
      setCurrentFeedback(feedback);
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: feedback
      }));
      setInterviewState(STATES.FEEDBACK);
    } catch (error) {
      console.error('Failed to process answer:', error);
      setInterviewState(STATES.READY);
    }
  };

  const handleTimerComplete = useCallback(() => {
    if (interviewState === STATES.RECORDING) {
      handleStopRecording();
    }
  }, [interviewState]);

  const handleNextQuestion = () => {
    if (!completedQuestions.includes(currentQuestionIndex)) {
      setCompletedQuestions(prev => [...prev, currentQuestionIndex]);
    }

    if (currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setInterviewState(STATES.READY);
      setCurrentFeedback(null);
    } else {
      setInterviewState(STATES.COMPLETED);
      // Navigate to results after a short delay
      setTimeout(() => {
        navigate(`/interview/${id}/result`);
      }, 1500);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      const prevFeedback = answers[interview.questions[currentQuestionIndex - 1]?.id];
      setCurrentFeedback(prevFeedback || null);
      setInterviewState(prevFeedback ? STATES.FEEDBACK : STATES.READY);
    }
  };

  const canGoNext = interviewState === STATES.FEEDBACK || completedQuestions.includes(currentQuestionIndex);
  const canGoPrevious = currentQuestionIndex > 0;

  if (interviewState === STATES.LOADING || !interview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (interviewState === STATES.COMPLETED) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Interview Complete!</h1>
          <p className="text-gray-600">Redirecting to your results...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Voice Interview</h1>
              <p className="text-sm text-gray-500">{interview.jobRole} at {interview.company}</p>
            </div>
            <Badge variant="primary">
              Question {currentQuestionIndex + 1} of {interview.questions.length}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar
            current={currentQuestionIndex}
            total={interview.questions.length}
            completedQuestions={completedQuestions}
          />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Question & Recording */}
          <div className="space-y-6">
            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <QuestionCard
                  question={currentQuestion}
                  index={currentQuestionIndex}
                  isActive
                />
              </motion.div>
            </AnimatePresence>

            {/* Play Question Button */}
            <Button
              onClick={handlePlayQuestion}
              variant="outline"
              className="w-full"
              disabled={interviewState === STATES.PLAYING_QUESTION || interviewState === STATES.RECORDING}
              icon={interviewState === STATES.PLAYING_QUESTION ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Volume2 className="w-5 h-5" />
                </motion.div>
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            >
              {interviewState === STATES.PLAYING_QUESTION ? 'Playing Question...' : 'Play Question Voice'}
            </Button>

            {/* Timer */}
            <Card className="p-6">
              <div className="flex justify-center">
                <Timer
                  duration={currentQuestion?.timeLimit || 120}
                  isRunning={isTimerRunning}
                  onComplete={handleTimerComplete}
                  size="lg"
                />
              </div>
            </Card>

            {/* Audio Recorder */}
            <Card className="p-6">
              <AudioRecorder
                isRecording={interviewState === STATES.RECORDING}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
                disabled={interviewState === STATES.PROCESSING || interviewState === STATES.PLAYING_QUESTION}
              />
            </Card>
          </div>

          {/* Right Column - Feedback */}
          <div>
            <AnimatePresence mode="wait">
              {interviewState === STATES.PROCESSING && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AnswerFeedback isLoading />
                </motion.div>
              )}

              {interviewState === STATES.FEEDBACK && currentFeedback && (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AnswerFeedback
                    transcript={currentFeedback.transcript}
                    score={currentFeedback.score}
                    feedback={currentFeedback.feedback}
                    skillScores={currentFeedback.skillScores}
                  />
                </motion.div>
              )}

              {interviewState === STATES.READY && !currentFeedback && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Record Your Answer
                    </h3>
                    <p className="text-sm text-gray-500">
                      Click the microphone button to start recording your response.
                      The AI will analyze your answer once you're done.
                    </p>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <Button
            onClick={handlePreviousQuestion}
            variant="outline"
            disabled={!canGoPrevious}
            icon={<ChevronLeft className="w-5 h-5" />}
          >
            Previous
          </Button>

          <Button
            onClick={handleNextQuestion}
            disabled={!canGoNext}
            icon={<ChevronRight className="w-5 h-5" />}
          >
            {currentQuestionIndex === interview.questions.length - 1 
              ? 'Finish Interview' 
              : 'Next Question'
            }
          </Button>
        </div>
      </main>
    </div>
  );
};

export default VoiceInterview;

