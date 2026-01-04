import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square } from 'lucide-react';

export const AudioRecorder = ({ 
  isRecording = false,
  onStartRecording,
  onStopRecording,
  disabled = false,
  showWaveform = true 
}) => {
  const [waveformBars, setWaveformBars] = useState(Array(20).fill(10));

  // Animate waveform when recording
  useEffect(() => {
    if (!isRecording) {
      setWaveformBars(Array(20).fill(10));
      return;
    }

    const interval = setInterval(() => {
      setWaveformBars(prev => prev.map(() => Math.random() * 40 + 10));
    }, 100);

    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Waveform Visualization */}
      {showWaveform && (
        <div className="flex items-center justify-center gap-1 h-16 px-4">
          {waveformBars.map((height, i) => (
            <motion.div
              key={i}
              className={`w-1 rounded-full ${
                isRecording ? 'bg-primary-500' : 'bg-gray-300'
              }`}
              animate={{ height: isRecording ? height : 10 }}
              transition={{ duration: 0.1 }}
            />
          ))}
        </div>
      )}

      {/* Recording Button */}
      <motion.button
        onClick={isRecording ? onStopRecording : onStartRecording}
        disabled={disabled}
        className={`
          relative flex items-center justify-center rounded-full transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isRecording 
            ? 'w-24 h-24 bg-red-500 hover:bg-red-600' 
            : 'w-24 h-24 bg-primary-600 hover:bg-primary-700'
          }
        `}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
      >
        {/* Pulsing ring animation when recording */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              className="absolute inset-0 rounded-full bg-red-500"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: 'easeOut'
              }}
            />
          )}
        </AnimatePresence>

        {/* Icon */}
        {isRecording ? (
          <Square className="w-10 h-10 text-white fill-white" />
        ) : (
          <Mic className="w-10 h-10 text-white" />
        )}
      </motion.button>

      {/* Status Text */}
      <p className={`text-sm font-medium ${isRecording ? 'text-red-600' : 'text-gray-600'}`}>
        {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
      </p>

      {/* Recording Indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full"
          >
            <motion.div
              className="w-3 h-3 bg-red-500 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-sm font-medium">Recording in progress</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioRecorder;

