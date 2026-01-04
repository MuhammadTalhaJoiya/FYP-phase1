import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, FileText, CheckCircle, Building, MapPin, Briefcase, DollarSign, Sparkles, Zap, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { jobsAPI, cvAPI, applicationsAPI } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

const JobApplication = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { user, isPremium, analysesLeft, decrementAnalyses } = useAuthStore();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [matching, setMatching] = useState(false);
    const [cvFile, setCvFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [matchData, setMatchData] = useState(null);
    const [cvUrl, setCvUrl] = useState(null);

    useEffect(() => {
        fetchJobDetails();
    }, [jobId]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const response = await jobsAPI.getById(jobId);
            setJob(response.data);
        } catch (error) {
            console.error('Error fetching job:', error);
            toast.error('Failed to load job details');
            navigate('/browse-jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files?.[0]) {
            handleFileSelection(e.target.files[0]);
        }
    };

    const handleFileSelection = (file) => {
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const validExtensions = ['.pdf', '.doc', '.docx'];
        const fileName = file.name.toLowerCase();
        
        const isValidType = validTypes.includes(file.type) || 
                          validExtensions.some(ext => fileName.endsWith(ext));

        if (isValidType) {
            setCvFile(file);
            setMatchData(null); // Reset match data when new file is selected
            setCvUrl(null);
        } else {
            toast.error('Please upload a PDF, DOC, or DOCX file');
        }
    };

    const handleCheckMatch = async () => {
        if (!cvFile) {
            toast.error('Please upload your CV first');
            return;
        }

        try {
            setMatching(true);
            const formData = new FormData();
            formData.append('cv', cvFile);

            const response = await cvAPI.match(jobId, formData);
            
            setMatchData(response.data.matchResult);
            setCvUrl(response.data.cvUrl);
            
            if (!isPremium) {
                decrementAnalyses();
            }
            
            toast.success('AI Matching complete!');
        } catch (error) {
            console.error('Error matching CV:', error);
            toast.error(error.message || 'Failed to analyze CV. Please try again.');
        } finally {
            setMatching(false);
        }
    };

    const handleSubmitApplication = async () => {
        if (!cvUrl || !matchData) {
            toast.error('Please check your match score first');
            return;
        }

        try {
            setSubmitting(true);

            await applicationsAPI.submit({
                jobId,
                cvUrl,
                matchScore: matchData.matchScore,
                matchedSkills: matchData.matchedSkills,
                missingSkills: matchData.missingSkills,
                aiFeedback: matchData.feedback
            });

            toast.success('Application submitted successfully!');
            setTimeout(() => {
                navigate('/my-applications');
            }, 1500);

        } catch (error) {
            console.error('Error submitting application:', error);
            toast.error(error.message || 'Failed to submit application. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!job) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate('/browse-jobs')} size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Jobs
                    </Button>
                    <div className="flex items-center gap-2">
                        {isPremium ? (
                            <Badge variant="warning" className="bg-amber-100 text-amber-700 border-amber-200">
                                <Sparkles className="w-3 h-3 mr-1" /> Premium
                            </Badge>
                        ) : (
                            <Badge variant="info">
                                <Zap className="w-3 h-3 mr-1" /> {analysesLeft} Matches Left
                            </Badge>
                        )}
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Job Details */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="p-6 sticky top-24">
                            <div className="mb-6">
                                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center text-2xl font-bold text-primary-600 mb-4">
                                    {job.company?.charAt(0)}
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
                                <p className="text-gray-600 font-medium">{job.company}</p>
                            </div>

                            <div className="space-y-4 text-sm text-gray-600">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span>{job.location}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Briefcase className="w-4 h-4 text-gray-400" />
                                    <span>{job.jobType}</span>
                                </div>
                                {job.salaryRange && (
                                    <div className="flex items-center gap-3">
                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                        <span>{job.salaryRange}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h3 className="font-semibold text-gray-900 mb-3">Requirements</h3>
                                <div className="flex flex-wrap gap-2">
                                    {typeof job.skills === 'string' ? JSON.parse(job.skills).map((skill, i) => (
                                        <Badge key={i} variant="default">{skill}</Badge>
                                    )) : job.skills?.map((skill, i) => (
                                        <Badge key={i} variant="default">{skill}</Badge>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Application Flow */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Apply for this Position</h2>
                                <p className="text-gray-600 mb-8">Follow the steps below to check your match and submit your application.</p>

                                {/* Step 1: Upload CV */}
                                <div className="mb-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">1</div>
                                        <h3 className="text-lg font-semibold text-gray-900">Upload Your CV</h3>
                                    </div>
                                    
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                        onDragLeave={() => setDragActive(false)}
                                        className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer ${
                                            dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
                                        } ${cvFile ? 'bg-green-50 border-green-200' : ''}`}
                                        onClick={() => document.getElementById('cv-upload').click()}
                                    >
                                        <input type="file" id="cv-upload" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                                        {cvFile ? (
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                                </div>
                                                <p className="text-lg font-medium text-gray-900">{cvFile.name}</p>
                                                <p className="text-sm text-gray-500">{(cvFile.size / 1024 / 1024).toFixed(2)} MB • Click to change</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                    <Upload className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <p className="text-lg font-medium text-gray-700">Drag & drop your CV here</p>
                                                <p className="text-sm text-gray-500">or click to browse files</p>
                                                <p className="text-xs text-gray-400 mt-2">Supports PDF, DOC, DOCX up to 5MB</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Step 2: Check Match */}
                                <div className="mb-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">2</div>
                                        <h3 className="text-lg font-semibold text-gray-900">Check Your AI Match Score</h3>
                                    </div>
                                    
                                    <AnimatePresence mode="wait">
                                        {matchData ? (
                                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                                                <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-6 border border-primary-100">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div>
                                                            <p className="text-sm font-medium text-primary-600 uppercase tracking-wider mb-1">AI Match Score</p>
                                                            <h4 className="text-4xl font-black text-gray-900">{matchData.matchScore}%</h4>
                                                        </div>
                                                        <div className="w-20 h-20">
                                                            <svg className="w-full h-full transform -rotate-90">
                                                                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200" />
                                                                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={226.19} strokeDashoffset={226.19 * (1 - matchData.matchScore / 100)} className="text-primary-600 transition-all duration-1000" />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-700 mb-2">AI Feedback:</p>
                                                            <div className="bg-white/50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed border border-white">
                                                                {matchData.feedback}
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                                                <p className="text-xs font-bold text-green-700 uppercase mb-2">Matched Skills</p>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {matchData.matchedSkills?.map((skill, i) => (
                                                                        <span key={i} className="px-2 py-0.5 bg-white text-green-700 rounded text-[10px] font-bold border border-green-200">{skill}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                                                                <p className="text-xs font-bold text-red-700 uppercase mb-2">Missing Skills</p>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {matchData.missingSkills?.map((skill, i) => (
                                                                        <span key={i} className="px-2 py-0.5 bg-white text-red-700 rounded text-[10px] font-bold border border-red-200">{skill}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm" onClick={() => setMatchData(null)} className="text-xs">
                                                    Re-analyze with different CV
                                                </Button>
                                            </motion.div>
                                        ) : (
                                            <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
                                                <Sparkles className="w-10 h-10 text-primary-400 mx-auto mb-4" />
                                                <h4 className="text-gray-900 font-semibold mb-2">See how well you fit!</h4>
                                                <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">Our AI will analyze your CV against the job requirements and give you a compatibility score.</p>
                                                <Button 
                                                    onClick={handleCheckMatch} 
                                                    disabled={!cvFile || matching} 
                                                    loading={matching}
                                                    className="w-full sm:w-auto"
                                                >
                                                    {matching ? 'Analyzing CV...' : 'Check Match Score'}
                                                </Button>
                                                {!isPremium && analysesLeft <= 0 && (
                                                    <div className="mt-4 flex items-center justify-center gap-2 text-red-600 text-xs font-medium">
                                                        <AlertCircle className="w-4 h-4" />
                                                        No analyses left. Please upgrade to premium.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Step 3: Apply */}
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">3</div>
                                        <h3 className="text-lg font-semibold text-gray-900">Finalize & Apply</h3>
                                    </div>
                                    
                                    <div className={`p-6 rounded-xl border-2 transition-all ${matchData ? 'border-primary-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                                        <p className="text-sm text-gray-600 mb-6">
                                            {matchData 
                                                ? "You're all set! Review your match score and click below to submit your application to the recruiter." 
                                                : "Please complete the previous steps to unlock the application submission."}
                                        </p>
                                        <Button 
                                            onClick={handleSubmitApplication} 
                                            disabled={!matchData || submitting} 
                                            loading={submitting}
                                            className="w-full py-6 text-lg font-bold"
                                        >
                                            {submitting ? 'Submitting Application...' : 'Submit Application Now'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobApplication;

