import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, VideoOff, Circle, Square, Camera } from 'lucide-react';
import { Button } from '../../ui/Button';

export const VideoRecorder = ({ 
  isRecording = false,
  onStartRecording,
  onStopRecording,
  disabled = false,
  recordingTime = 0 
}) => {
  const [cameraEnabled, setCameraEnabled] = useState(true);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Camera Preview Placeholder */}
      <div className="relative w-full max-w-md aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
        {cameraEnabled ? (
          <>
            {/* Simulated camera feed placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="text-center">
                <Camera className="w-16 h-16 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Camera Preview</p>
                <p className="text-gray-500 text-xs mt-1">(Placeholder - will show real feed)</p>
              </div>
            </div>

            {/* Recording indicator overlay */}
            <AnimatePresence>
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-full"
                >
                  <motion.div
                    className="w-2.5 h-2.5 bg-white rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-white text-sm font-medium">REC</span>
                  <span className="text-white text-sm font-mono">{formatTime(recordingTime)}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Frame border when recording */}
            {isRecording && (
              <motion.div
                className="absolute inset-0 border-4 border-red-500 rounded-2xl"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <VideoOff className="w-16 h-16 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Camera is off</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Camera Toggle */}
        <button
          onClick={() => setCameraEnabled(!cameraEnabled)}
          className={`p-3 rounded-full transition-colors ${
            cameraEnabled 
              ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
              : 'bg-red-100 hover:bg-red-200 text-red-600'
          }`}
        >
          {cameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Record Button */}
        <motion.button
          onClick={isRecording ? onStopRecording : onStartRecording}
          disabled={disabled || !cameraEnabled}
          className={`
            flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all
            ${disabled || !cameraEnabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${isRecording 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-primary-600 hover:bg-primary-700 text-white'
            }
          `}
          whileHover={!(disabled || !cameraEnabled) ? { scale: 1.03 } : {}}
          whileTap={!(disabled || !cameraEnabled) ? { scale: 0.97 } : {}}
        >
          {isRecording ? (
            <>
              <Square className="w-5 h-5 fill-white" />
              <span>Stop Recording</span>
            </>
          ) : (
            <>
              <Circle className="w-5 h-5 fill-red-500 text-red-500" />
              <span>Start Recording</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Status Text */}
      <p className={`text-sm ${isRecording ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
        {!cameraEnabled 
          ? 'Enable camera to record' 
          : isRecording 
            ? 'Recording your response...' 
            : 'Ready to record when you are'
        }
      </p>
    </div>
  );
};

export default VideoRecorder;

