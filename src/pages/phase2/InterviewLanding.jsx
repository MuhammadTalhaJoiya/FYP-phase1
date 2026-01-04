import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Mic, Video, Clock, CheckCircle, AlertCircle, 
  Briefcase, Building2, User, Play, Shield
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { mockFetchInterview, interviewInstructions } from '../../data/interviewDummyData';

const InterviewLanding = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissionsChecked, setPermissionsChecked] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState({
    microphone: 'pending',
    camera: 'pending',
  });

  useEffect(() => {
    loadInterview();
  }, [id]);

  const loadInterview = async () => {
    setLoading(true);
    try {
      const data = await mockFetchInterview(id);
      setInterview(data);
    } catch (error) {
      console.error('Failed to load interview:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPermissions = async () => {
    setPermissionsChecked(true);
    
    // Simulate permission check
    // In production, this would use navigator.mediaDevices.getUserMedia
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPermissionStatus({
      microphone: 'granted',
      camera: interview?.interviewType === 'video' ? 'granted' : 'not_required',
    });
  };

  const handleStartInterview = () => {
    const route = interview.interviewType === 'video' 
      ? `/interview/${id}/video`
      : `/interview/${id}/voice`;
    navigate(route);
  };

  const instructions = interview?.interviewType === 'video' 
    ? interviewInstructions.video 
    : interviewInstructions.voice;

  const allPermissionsGranted = 
    permissionStatus.microphone === 'granted' && 
    (permissionStatus.camera === 'granted' || permissionStatus.camera === 'not_required');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 space-y-6">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className={`
                w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center
                ${interview.interviewType === 'video' 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-br from-primary-500 to-primary-600'
                }
              `}
            >
              {interview.interviewType === 'video' 
                ? <Video className="w-10 h-10 text-white" />
                : <Mic className="w-10 h-10 text-white" />
              }
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI {interview.interviewType === 'video' ? 'Video' : 'Voice'} Interview
            </h1>
            <p className="text-gray-600">
              Complete your interview at your own pace
            </p>
          </div>

          {/* Interview Details Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              {/* Candidate Info */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="w-7 h-7 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Candidate</p>
                  <p className="text-lg font-semibold text-gray-900">{interview.candidateName}</p>
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-3 gap-4 py-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Briefcase className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 mb-1">Position</p>
                  <p className="text-sm font-semibold text-gray-900">{interview.jobRole}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Building2 className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 mb-1">Company</p>
                  <p className="text-sm font-semibold text-gray-900">{interview.company}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Clock className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 mb-1">Questions</p>
                  <p className="text-sm font-semibold text-gray-900">{interview.questions.length} total</p>
                </div>
              </div>

              {/* Interview Type Badge */}
              <div className="flex justify-center">
                <Badge 
                  variant={interview.interviewType === 'video' ? 'info' : 'primary'}
                  className="text-base px-4 py-1"
                >
                  {interview.interviewType === 'video' ? (
                    <><Video className="w-4 h-4 mr-2" /> Video Interview</>
                  ) : (
                    <><Mic className="w-4 h-4 mr-2" /> Voice Interview</>
                  )}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Instructions Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-600" />
                Interview Instructions
              </h2>
              <ul className="space-y-3">
                {instructions.map((instruction, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{instruction}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Permissions Check */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Device Permissions
              </h2>
              
              {!permissionsChecked ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">
                    We need to check your {interview.interviewType === 'video' ? 'camera and microphone' : 'microphone'} access
                  </p>
                  <Button onClick={checkPermissions}>
                    Check Permissions
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Microphone Status */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mic className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Microphone</span>
                    </div>
                    {permissionStatus.microphone === 'granted' ? (
                      <Badge variant="success">
                        <CheckCircle className="w-4 h-4 mr-1" /> Granted
                      </Badge>
                    ) : (
                      <Badge variant="error">
                        <AlertCircle className="w-4 h-4 mr-1" /> Denied
                      </Badge>
                    )}
                  </div>

                  {/* Camera Status (for video interviews) */}
                  {interview.interviewType === 'video' && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">Camera</span>
                      </div>
                      {permissionStatus.camera === 'granted' ? (
                        <Badge variant="success">
                          <CheckCircle className="w-4 h-4 mr-1" /> Granted
                        </Badge>
                      ) : (
                        <Badge variant="error">
                          <AlertCircle className="w-4 h-4 mr-1" /> Denied
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={handleStartInterview}
              disabled={!permissionsChecked || !allPermissionsGranted}
              className="w-full"
              size="xl"
              icon={<Play className="w-6 h-6" />}
            >
              Start Interview
            </Button>
            
            {!permissionsChecked && (
              <p className="text-center text-sm text-gray-500 mt-3">
                Please check device permissions before starting
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default InterviewLanding;

