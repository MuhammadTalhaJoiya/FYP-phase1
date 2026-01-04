import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Volume2, ChevronRight, ChevronLeft, 
  Loader2, CheckCircle, AlertCircle, Video
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Timer } from '../../components/phase2/interview/Timer';
import { QuestionCard } from '../../components/phase2/interview/QuestionCard';
import { VideoRecorder } from '../../components/phase2/interview/VideoRecorder';
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

const VideoInterview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewState, setInterviewState] = useState(STATES.LOADING);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentFeedback, setCurrentFeedback] = useState(null);

  useEffect(() => {
    loadInterview();
  }, [id]);

  // Recording timer
  useEffect(() => {
    let interval;
    if (interviewState === STATES.RECORDING) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [interviewState]);

  const loadInterview = async () => {
    try {
      const data = await mockFetchInterview(id);
      // Override interview type to video
      setInterview({ ...data, interviewType: 'video' });
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
      // Add video-specific scores
      const videoFeedback = {
        ...feedback,
        skillScores: {
          ...feedback.skillScores,
          presentation: Math.floor(Math.random() * 20) + 75,
          body_language: Math.floor(Math.random() * 20) + 70,
        }
      };
      setCurrentFeedback(videoFeedback);
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: videoFeedback
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
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Video Interview</h1>
                <p className="text-sm text-gray-400">{interview.jobRole} at {interview.company}</p>
              </div>
            </div>
            <Badge variant="info" className="text-base">
              Question {currentQuestionIndex + 1} of {interview.questions.length}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Progress Bar */}
        <div className="mb-6 bg-gray-800 rounded-xl p-4">
          <ProgressBar
            current={currentQuestionIndex}
            total={interview.questions.length}
            completedQuestions={completedQuestions}
          />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Video Recording */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Recorder */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <VideoRecorder
                  isRecording={interviewState === STATES.RECORDING}
                  onStartRecording={handleStartRecording}
                  onStopRecording={handleStopRecording}
                  disabled={interviewState === STATES.PROCESSING || interviewState === STATES.PLAYING_QUESTION}
                  recordingTime={recordingTime}
                />
              </CardContent>
            </Card>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
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
              className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
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
              {interviewState === STATES.PLAYING_QUESTION ? 'Playing Question...' : 'Play Question Voice (Optional)'}
            </Button>
          </div>

          {/* Right Column - Timer & Feedback */}
          <div className="space-y-6">
            {/* Timer */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-center">
                  <Timer
                    duration={currentQuestion?.timeLimit || 120}
                    isRunning={isTimerRunning}
                    onComplete={handleTimerComplete}
                    size="md"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Feedback Panel */}
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

              {(interviewState === STATES.READY && !currentFeedback) && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6 text-center">
                      <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">
                        Record Your Answer
                      </h3>
                      <p className="text-sm text-gray-400">
                        Click "Start Recording" to record your video response.
                        AI will analyze both your speech and presentation.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
          <Button
            onClick={handlePreviousQuestion}
            variant="outline"
            className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            disabled={!canGoPrevious}
            icon={<ChevronLeft className="w-5 h-5" />}
          >
            Previous
          </Button>

          <Button
            onClick={handleNextQuestion}
            disabled={!canGoNext}
            className="bg-blue-600 hover:bg-blue-700"
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

export default VideoInterview;

