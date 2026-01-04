import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Users, Calendar, Plus, CheckCircle, Crown, Zap, LogOut, Eye, Mic, Video } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { NotificationDropdown } from '../components/NotificationDropdown';
import { RECRUITER_PRICING, formatPrice, DEFAULT_CURRENCY } from '../lib/pricing';
import { jobsAPI } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

const RecruiterDashboard = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuthStore();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('PROFESSIONAL');
    const [postedJobs, setPostedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Track recruiter payment/subscription status
    const [currentPlan, setCurrentPlan] = useState(() => {
        return localStorage.getItem('recruiterPlan') || null; // null = no plan yet
    });

    // Fetch recruiter's posted jobs
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const response = await jobsAPI.getRecruiterJobs();
                // Backend returns { data: { jobs: [...], pagination: {...} } }
                setPostedJobs(response.data?.jobs || []);
            } catch (error) {
                console.error('Error fetching jobs:', error);
                toast.error('Failed to load your jobs');
                setPostedJobs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Persist plan selection
    useEffect(() => {
        if (currentPlan) {
            localStorage.setItem('recruiterPlan', currentPlan);
        }
    }, [currentPlan]);

    const handlePostJobClick = () => {
        // Backend will handle subscription validation
        // Just navigate to the post job page
        navigate('/recruiter/post-job');
    };

    const handleSubscribe = (plan) => {
        // Simulate payment - in production, integrate with Stripe/PayPal/JazzCash
        setCurrentPlan(plan);
        setShowPaymentModal(false);
        toast.success(`🎉 Welcome to ${RECRUITER_PRICING[plan].name}! Your subscription is active.`);
    };

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const getPlanFeatures = () => {
        if (!currentPlan) return null;
        return RECRUITER_PRICING[currentPlan];
    };

    const currentPlanData = getPlanFeatures();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar & Navigation */}
            <div className="flex">
                <aside className="w-64 bg-white min-h-screen border-r border-gray-200 hidden md:block fixed">
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">Recruiter Portal</span>
                        </div>
                        {currentPlan && (
                            <div className="mb-6 px-3 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-300 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Crown className="w-4 h-4 text-purple-700" />
                                    <p className="text-xs font-semibold text-purple-700">
                                        {RECRUITER_PRICING[currentPlan].name} Plan
                                    </p>
                                </div>
                            </div>
                        )}

                        <nav className="space-y-1">
                            <button className="flex items-center gap-3 w-full px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg font-medium">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                Dashboard
                            </button>
                            <button
                                onClick={handlePostJobClick}
                                className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                            >
                                <Plus className="w-5 h-5" />
                                Post a New Job
                            </button>
                            <button
                                onClick={() => navigate('/recruiter/create-interview')}
                                className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition relative"
                            >
                                <div className="flex items-center gap-1">
                                    <Mic className="w-4 h-4" />
                                    <Video className="w-4 h-4" />
                                </div>
                                <span>AI Interviews</span>
                                <Badge variant="primary" className="ml-auto text-xs">New</Badge>
                            </button>
                            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                                <Users className="w-5 h-5" />
                                Candidates
                            </button>
                            <button 
                                onClick={() => setShowPaymentModal(true)}
                                className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                            >
                                <Crown className="w-5 h-5" />
                                Upgrade Plan
                            </button>
                        </nav>
                    </div>

                    <div className="absolute bottom-0 w-full p-6 border-t border-gray-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <span className="font-semibold text-white">
                                    {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'R'}
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{user?.fullName || 'Recruiter'}</p>
                                <p className="text-xs text-gray-500">{user?.role || 'recruiter'}</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            icon={<LogOut className="w-4 h-4" />}
                            className="w-full text-sm"
                        >
                            Logout
                        </Button>
                    </div>
                </aside>

                <main className="flex-1 ml-64 p-8">
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Welcome back, {user?.fullName?.split(' ')[0] || 'Recruiter'}! 👋
                            </h1>
                            <p className="text-gray-600 mt-1">Manage your job postings and review top talent.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <NotificationDropdown />
                            <Button
                                onClick={() => navigate('/recruiter/create-interview')}
                                variant="outline"
                                icon={<Mic className="w-5 h-5" />}
                            >
                                Create AI Interview
                            </Button>
                            <Button
                                onClick={handlePostJobClick}
                                icon={<Plus className="w-5 h-5" />}
                            >
                                Post New Job
                            </Button>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card hover>
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Briefcase className="w-6 h-6 text-blue-600" />
                                </div>
                                {postedJobs.length > 0 && <Badge variant="success">Active</Badge>}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{postedJobs.length}</h3>
                            <p className="text-gray-600 text-sm">Active Job Postings</p>
                        </Card>
                        <Card hover>
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <Users className="w-6 h-6 text-purple-600" />
                                </div>
                                <Badge variant="default">Coming Soon</Badge>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">0</h3>
                            <p className="text-gray-600 text-sm">Total Applications</p>
                        </Card>
                        <Card hover onClick={() => navigate('/recruiter/create-interview')} className="cursor-pointer">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
                                    <div className="flex items-center gap-1">
                                        <Mic className="w-4 h-4 text-purple-600" />
                                        <Video className="w-4 h-4 text-indigo-600" />
                                    </div>
                                </div>
                                <Badge variant="primary">New</Badge>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">AI Interview</h3>
                            <p className="text-gray-600 text-sm">Create Voice/Video Interview</p>
                        </Card>
                    </div>

                    {/* Active Jobs List */}
                    <Card>
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900">Your Active Job Postings</h2>
                        </div>
                        {loading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                                <p className="text-gray-600 mt-4">Loading your jobs...</p>
                            </div>
                        ) : postedJobs.length === 0 ? (
                            <div className="p-12 text-center">
                                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
                                <p className="text-gray-600 mb-6">Start attracting top talent by posting your first job!</p>
                                <Button onClick={handlePostJobClick} icon={<Plus className="w-5 h-5" />}>
                                    Post Your First Job
                                </Button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {postedJobs.map((job) => {
                                    // Parse skills if they're stored as JSON string
                                    const skills = typeof job.skills === 'string' 
                                        ? JSON.parse(job.skills || '[]') 
                                        : (job.skills || []);
                                    
                                    return (
                                        <div key={job.id} className="p-6 hover:bg-gray-50 transition">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                                                        <Badge variant={job.status === 'active' ? 'success' : 'default'}>
                                                            {job.status}
                                                        </Badge>
                                                    </div>
                                                    
                                                    <p className="text-gray-700 mb-3">{job.company}</p>
                                                    
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {job.location}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Briefcase className="w-4 h-4" />
                                                            {job.jobType}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {new Date(job.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    
                                                    {skills.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mb-3">
                                                            {skills.slice(0, 5).map((skill, idx) => (
                                                                <span 
                                                                    key={idx}
                                                                    className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                            {skills.length > 5 && (
                                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                                    +{skills.length - 5} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex flex-col items-end gap-3 ml-6">
                                                    <div className="text-center px-4 py-2 bg-primary-50 rounded-lg">
                                                        <span className="block text-2xl font-bold text-primary-600">
                                                            {job.applicationCount || 0}
                                                        </span>
                                                        <span className="text-xs text-gray-500 uppercase tracking-wide">Applications</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            onClick={() => navigate(`/recruiter/applications/${job.id}`)}
                                                            variant="default"
                                                            size="sm"
                                                            icon={<Eye className="w-4 h-4" />}
                                                        >
                                                            View Applications
                                                        </Button>
                                                        <Button
                                                            onClick={() => navigate(`/recruiter/job/${job.id}`)}
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            Details
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </main>
            </div>

            {/* Recruiter Subscription Modal */}
            <AnimatePresence>
                {showPaymentModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl max-w-6xl w-full p-8 shadow-xl my-8"
                        >
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Crown className="w-8 h-8 text-indigo-600" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900">Choose Your Plan</h3>
                                <p className="text-gray-500 mt-2">Select a plan to start posting jobs and finding top talent</p>
                                <Badge variant="success" className="mt-3">
                                    💰 Special Launch Pricing - Limited Time!
                                </Badge>
                            </div>

                            <div className="grid md:grid-cols-4 gap-4 mb-8">
                                {/* Pay Per Post */}
                                <Card 
                                    className={`p-6 cursor-pointer transition border-2 ${selectedPlan === 'PAY_PER_POST' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
                                    onClick={() => setSelectedPlan('PAY_PER_POST')}
                                >
                                    <div className="mb-4">
                                        <h4 className="font-bold text-gray-900">{RECRUITER_PRICING.PAY_PER_POST.name}</h4>
                                        <p className="text-xs text-gray-600 mt-1">{RECRUITER_PRICING.PAY_PER_POST.bestFor}</p>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900 mb-1">
                                        {formatPrice(RECRUITER_PRICING.PAY_PER_POST.price[DEFAULT_CURRENCY], DEFAULT_CURRENCY)}
                                    </p>
                                    <p className="text-xs text-gray-600 mb-4">per {RECRUITER_PRICING.PAY_PER_POST.period}</p>
                                    <ul className="space-y-2">
                                        {RECRUITER_PRICING.PAY_PER_POST.features.slice(0, 4).map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                                                <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>

                                {/* Starter */}
                                <Card 
                                    className={`p-6 cursor-pointer transition border-2 ${selectedPlan === 'STARTER' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
                                    onClick={() => setSelectedPlan('STARTER')}
                                >
                                    <div className="mb-4">
                                        <h4 className="font-bold text-gray-900">{RECRUITER_PRICING.STARTER.name}</h4>
                                        <p className="text-xs text-gray-600 mt-1">{RECRUITER_PRICING.STARTER.bestFor}</p>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900 mb-1">
                                        {formatPrice(RECRUITER_PRICING.STARTER.price[DEFAULT_CURRENCY], DEFAULT_CURRENCY)}
                                    </p>
                                    <p className="text-xs text-gray-600 mb-4">per {RECRUITER_PRICING.STARTER.period}</p>
                                    <ul className="space-y-2">
                                        {RECRUITER_PRICING.STARTER.features.slice(0, 4).map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                                                <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>

                                {/* Professional - Most Popular */}
                                <Card 
                                    className={`p-6 cursor-pointer transition border-2 relative ${selectedPlan === 'PROFESSIONAL' ? 'border-purple-500 bg-purple-50' : 'border-purple-300'}`}
                                    onClick={() => setSelectedPlan('PROFESSIONAL')}
                                >
                                    <Badge variant="primary" className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                                        ⭐ MOST POPULAR
                                    </Badge>
                                    <div className="mb-4 mt-2">
                                        <h4 className="font-bold text-gray-900">{RECRUITER_PRICING.PROFESSIONAL.name}</h4>
                                        <p className="text-xs text-gray-600 mt-1">{RECRUITER_PRICING.PROFESSIONAL.bestFor}</p>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900 mb-1">
                                        {formatPrice(RECRUITER_PRICING.PROFESSIONAL.price[DEFAULT_CURRENCY], DEFAULT_CURRENCY)}
                                    </p>
                                    <p className="text-xs text-gray-600 mb-4">per {RECRUITER_PRICING.PROFESSIONAL.period}</p>
                                    <ul className="space-y-2">
                                        {RECRUITER_PRICING.PROFESSIONAL.features.slice(0, 5).map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                                                <CheckCircle className="w-3 h-3 text-purple-600 flex-shrink-0 mt-0.5" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>

                                {/* Enterprise */}
                                <Card 
                                    className={`p-6 cursor-pointer transition border-2 ${selectedPlan === 'ENTERPRISE' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
                                    onClick={() => setSelectedPlan('ENTERPRISE')}
                                >
                                    <Badge variant="warning" className="mb-2">🚀 Best Value</Badge>
                                    <div className="mb-4">
                                        <h4 className="font-bold text-gray-900">{RECRUITER_PRICING.ENTERPRISE.name}</h4>
                                        <p className="text-xs text-gray-600 mt-1">{RECRUITER_PRICING.ENTERPRISE.bestFor}</p>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900 mb-1">
                                        {formatPrice(RECRUITER_PRICING.ENTERPRISE.price[DEFAULT_CURRENCY], DEFAULT_CURRENCY)}
                                    </p>
                                    <p className="text-xs text-gray-600 mb-4">per {RECRUITER_PRICING.ENTERPRISE.period}</p>
                                    <ul className="space-y-2">
                                        {RECRUITER_PRICING.ENTERPRISE.features.slice(0, 5).map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                                                <CheckCircle className="w-3 h-3 text-indigo-600 flex-shrink-0 mt-0.5" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </div>

                            {/* Selected Plan Summary */}
                            {selectedPlan && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border border-indigo-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">
                                                You selected: {RECRUITER_PRICING[selectedPlan].name}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {RECRUITER_PRICING[selectedPlan].bestFor}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-gray-900">
                                                {formatPrice(RECRUITER_PRICING[selectedPlan].price[DEFAULT_CURRENCY], DEFAULT_CURRENCY)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                per {RECRUITER_PRICING[selectedPlan].period}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex-1"
                                >
                                    Maybe Later
                                </Button>
                                <Button
                                    onClick={() => handleSubscribe(selectedPlan)}
                                    disabled={!selectedPlan}
                                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                    icon={<Zap className="w-5 h-5" />}
                                >
                                    Subscribe to {selectedPlan && RECRUITER_PRICING[selectedPlan].name}
                                </Button>
                            </div>

                            <p className="text-center text-xs text-gray-500 mt-4">
                                💳 Secure payment powered by Stripe • Cancel anytime • No hidden fees
                            </p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RecruiterDashboard;
