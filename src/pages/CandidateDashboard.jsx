import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Upload, Briefcase, BarChart3, LogOut, Home, FileText, Download, Eye, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../stores/authStore';
import { NotificationPanel } from '../components/NotificationPanel';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { ApplicationTrendChart, SkillProficiencyChart } from '../components/AnalyticsChart';
import { getInitials } from '../lib/utils';
import { applicationsAPI } from '../lib/api';

const CandidateDashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, isPremium, analysesLeft } = useAuthStore();
    const [uploadedCV, setUploadedCV] = useState(null);
    const [loadingCV, setLoadingCV] = useState(true);

    // Fetch candidate's applications to get their CV
    useEffect(() => {
        const fetchCV = async () => {
            try {
                setLoadingCV(true);
                const response = await applicationsAPI.getMy();
                const apps = response.data?.applications || [];
                
                // Get the most recent application with a CV
                if (apps.length > 0) {
                    // Sort by most recent
                    const sorted = apps.sort((a, b) => 
                        new Date(b.appliedAt) - new Date(a.appliedAt)
                    );
                    // Get the first one with a CV
                    const appWithCV = sorted.find(app => app.cvUrl);
                    if (appWithCV) {
                        setUploadedCV({
                            cvUrl: appWithCV.cvUrl,
                            uploadedAt: appWithCV.appliedAt,
                            jobTitle: appWithCV.job?.title
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching CV:', error);
            } finally {
                setLoadingCV(false);
            }
        };
        fetchCV();
    }, []);

    // Mock data
    const stats = {
        activeApplications: 3,
        matchScore: 78,
        interviewsCompleted: 2,
    };

    const applications = [
        { id: 1, job: 'Senior React Developer', company: 'TechCorp', status: 'Under Review', matchScore: 85 },
        { id: 2, job: 'Full Stack Engineer', company: 'StartupXYZ', status: 'Interview Scheduled', matchScore: 78, interviewDate: 'Dec 25, 2025 at 2:00 PM' },
        { id: 3, job: 'Frontend Developer', company: 'WebSolutions', status: 'Shortlisted', matchScore: 72 },
    ];

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Shortlisted': return 'success';
            case 'Interview Scheduled': return 'info';
            case 'Under Review': return 'warning';
            case 'Pending': return 'default';
            default: return 'default';
        }
    };

    const handleLogout = () => {
        useAuthStore.getState().logout();
        toast.success('Logged out successfully!');
        setTimeout(() => navigate('/'), 500);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            icon={<Menu className="w-5 h-5" />}
                        />
                        <h1 className="text-xl font-bold text-primary-600">AI Recruitment</h1>
                        {isPremium && (
                            <Badge variant="primary" className="hidden md:flex">
                                ⭐ Premium
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationPanel />
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium">{user?.fullName || 'Candidate'}</p>
                                <p className="text-xs text-gray-500">Candidate</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {getInitials(user?.fullName || 'Candidate')}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.aside
                            initial={{ x: -264 }}
                            animate={{ x: 0 }}
                            exit={{ x: -264 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-20"
                        >
                            <nav className="p-4 space-y-2">
                                <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-primary-50 text-primary-700 font-medium transition">
                                    <Home className="w-5 h-5" />
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => navigate('/browse-jobs')}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                                >
                                    <Briefcase className="w-5 h-5" />
                                    Browse Jobs
                                </button>
                                <button
                                    onClick={() => navigate('/my-applications')}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                                >
                                    <BarChart3 className="w-5 h-5" />
                                    My Applications
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 mt-8 transition"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </nav>

                            {/* Usage Stats in Sidebar */}
                            {!isPremium && (
                                <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
                                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-200">
                                        <p className="text-xs font-medium text-gray-700 mb-2">CV Analyses Left</p>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Progress value={analysesLeft} max={10} className="h-2" />
                                            <span className="text-xs font-semibold text-gray-700">{analysesLeft}/10</span>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            className="w-full text-xs"
                                            onClick={() => toast.info('Upgrade to premium for unlimited analyses!')}
                                        >
                                            Upgrade to Premium
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header */}
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6"
                        >
                            <h1 className="text-3xl font-bold text-gray-900">
                                Welcome back, {user?.fullName?.split(' ')[0] || 'Candidate'}! 👋
                            </h1>
                            <p className="text-gray-600 mt-1">Here's your application overview and job matches.</p>
                        </motion.div>

                        {/* Stats Cards */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="grid md:grid-cols-3 gap-6 mb-6"
                        >
                            <Card hover>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Active Applications</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeApplications}</p>
                                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                            <span>↑</span> +1 this week
                                        </p>
                                    </div>
                                    <div className="p-3 bg-primary-100 rounded-lg">
                                        <Briefcase className="w-6 h-6 text-primary-600" />
                                    </div>
                                </div>
                            </Card>

                            <Card hover>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Avg Match Score</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.matchScore}%</p>
                                        <Progress value={stats.matchScore} className="mt-2" />
                                    </div>
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <BarChart3 className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </Card>

                            <Card hover>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Interviews Completed</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.interviewsCompleted}</p>
                                        <p className="text-xs text-blue-600 mt-1">2 scheduled</p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* My CV Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-primary-600" />
                                        My CV
                                    </h3>
                                    <Button
                                        size="sm"
                                        onClick={() => navigate('/browse-jobs')}
                                        icon={<Briefcase className="w-4 h-4" />}
                                    >
                                        Find More Jobs
                                    </Button>
                                </div>
                                
                                {loadingCV ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                                    </div>
                                ) : uploadedCV ? (
                                    <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg p-6 border border-primary-200">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-white rounded-lg shadow-sm">
                                                <FileText className="w-8 h-8 text-primary-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 mb-1">Your Resume</h4>
                                                <p className="text-sm text-gray-600 mb-1">
                                                    {uploadedCV.jobTitle && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <Briefcase className="w-3 h-3" />
                                                            Last used for: {uploadedCV.jobTitle}
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500 mb-3">
                                                    Uploaded: {uploadedCV.uploadedAt ? new Date(uploadedCV.uploadedAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : 'Recently'}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    <a
                                                        href={uploadedCV.cvUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View CV
                                                    </a>
                                                    <a
                                                        href={uploadedCV.cvUrl}
                                                        download
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 transition text-sm font-medium"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Download
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                        <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <h4 className="font-medium text-gray-900 mb-1">Find Your Next Role</h4>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Browse active job postings and check your AI match score
                                        </p>
                                        <Button
                                            onClick={() => navigate('/browse-jobs')}
                                            icon={<Briefcase className="w-4 h-4" />}
                                        >
                                            Browse Jobs
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Button
                                        onClick={() => navigate('/browse-jobs')}
                                        icon={<Briefcase className="w-5 h-5" />}
                                    >
                                        Browse Jobs
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => toast.success('Profile settings coming soon!')}
                                    >
                                        Edit Profile
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Analytics Charts */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="grid md:grid-cols-2 gap-6 mb-6"
                        >
                            <ApplicationTrendChart />
                            <SkillProficiencyChart />
                        </motion.div>

                        {/* Recent Applications */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Card>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
                                <div className="space-y-3">
                                    {applications.map((app, index) => (
                                        <motion.div
                                            key={app.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + index * 0.1 }}
                                            whileHover={{ x: 4 }}
                                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                                            onClick={() => {
                                                navigate(`/match-result/${app.id}`);
                                                toast.success('Loading match details...');
                                            }}
                                        >
                                            <div>
                                                <h4 className="font-medium text-gray-900">{app.job}</h4>
                                                <p className="text-sm text-gray-600">{app.company}</p>
                                                {app.interviewDate && (
                                                    <p className="text-xs text-primary-600 mt-1 font-medium">
                                                        📅 {app.interviewDate}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-600">Match Score</p>
                                                    <p className="font-semibold text-primary-600">{app.matchScore}%</p>
                                                </div>
                                                <Badge variant={getStatusVariant(app.status)}>
                                                    {app.status}
                                                </Badge>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CandidateDashboard;
