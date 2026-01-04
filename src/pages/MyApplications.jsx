import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import { applicationsAPI } from '../lib/api';
import { JobCardSkeleton } from '../components/ui/Skeleton';

const MyApplications = () => {
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState('all');
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch applications on mount
    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async (showRefreshToast = false) => {
        try {
            if (showRefreshToast) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await applicationsAPI.getMy();
            const applicationsData = response.data?.applications || [];

            // Transform backend data to display format
            const transformedApplications = applicationsData.map(app => ({
                id: app.id,
                job: app.job?.title || 'Unknown Job',
                company: app.job?.company || 'Unknown Company',
                location: app.job?.location || 'Unknown Location',
                appliedDate: new Date(app.appliedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                }),
                status: formatStatus(app.status),
                matchScore: app.matchScore ? Math.round(app.matchScore) : 0,
                cvUrl: app.cvUrl,
                coverLetter: app.coverLetter,
                aiFeedback: app.aiFeedback,
                reviewedAt: app.reviewedAt,
                jobId: app.jobId,
                rawStatus: app.status, // Keep original status for filtering
            }));

            setApplications(transformedApplications);

            if (showRefreshToast) {
                toast.success('Applications refreshed!');
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load applications. Please try again.');
            setApplications([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        fetchApplications(true);
    };

    const handleWithdraw = async (applicationId) => {
        if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
            return;
        }

        try {
            await applicationsAPI.withdraw(applicationId);
            toast.success('Application withdrawn successfully');
            // Refresh the applications list
            fetchApplications();
        } catch (error) {
            console.error('Error withdrawing application:', error);
            toast.error(error.message || 'Failed to withdraw application');
        }
    };

    // Format backend status to display format
    const formatStatus = (status) => {
        const statusMap = {
            'pending': 'Pending',
            'reviewing': 'Under Review',
            'shortlisted': 'Shortlisted',
            'interview': 'Interview Scheduled',
            'rejected': 'Rejected',
            'accepted': 'Accepted'
        };
        return statusMap[status] || status;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Shortlisted': return 'bg-green-100 text-green-700';
            case 'Interview Scheduled': return 'bg-blue-100 text-blue-700';
            case 'Under Review': return 'bg-yellow-100 text-yellow-700';
            case 'Pending': return 'bg-gray-100 text-gray-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            case 'Accepted': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredApplications = filterStatus === 'all'
        ? applications
        : applications.filter(app => app.status === filterStatus);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-primary-600">AI Recruitment</h1>
                    <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        ← Back to Dashboard
                    </button>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8 max-w-7xl">
                {/* Page Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                        <p className="text-gray-600 mt-1">Track all your job applications in one place</p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>

                {loading ? (
                    <>
                        <div className="grid md:grid-cols-4 gap-4 mb-6">
                            {[...Array(4)].map((_, i) => (
                                <JobCardSkeleton key={i} />
                            ))}
                        </div>
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <JobCardSkeleton key={i} />
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid md:grid-cols-5 gap-4 mb-6">
                            <div className="bg-white rounded-xl shadow-sm p-4 border">
                                <p className="text-sm text-gray-600">Total</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{applications.length}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4 border">
                                <p className="text-sm text-gray-600">Under Review</p>
                                <p className="text-2xl font-bold text-yellow-600 mt-1">
                                    {applications.filter(a => a.status === 'Under Review').length}
                                </p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4 border">
                                <p className="text-sm text-gray-600">Shortlisted</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">
                                    {applications.filter(a => a.status === 'Shortlisted').length}
                                </p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4 border">
                                <p className="text-sm text-gray-600">Interviews</p>
                                <p className="text-2xl font-bold text-blue-600 mt-1">
                                    {applications.filter(a => a.status === 'Interview Scheduled').length}
                                </p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4 border">
                                <p className="text-sm text-gray-600">Rejected</p>
                                <p className="text-2xl font-bold text-red-600 mt-1">
                                    {applications.filter(a => a.status === 'Rejected').length}
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {/* Filters */}
                {!loading && (
                    <div className="bg-white rounded-xl shadow-sm p-4 border mb-6">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition ${filterStatus === 'all'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All ({applications.length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('Pending')}
                                className={`px-4 py-2 rounded-lg font-medium transition ${filterStatus === 'Pending'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Pending ({applications.filter(a => a.status === 'Pending').length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('Under Review')}
                                className={`px-4 py-2 rounded-lg font-medium transition ${filterStatus === 'Under Review'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Under Review ({applications.filter(a => a.status === 'Under Review').length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('Shortlisted')}
                                className={`px-4 py-2 rounded-lg font-medium transition ${filterStatus === 'Shortlisted'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Shortlisted ({applications.filter(a => a.status === 'Shortlisted').length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('Interview Scheduled')}
                                className={`px-4 py-2 rounded-lg font-medium transition ${filterStatus === 'Interview Scheduled'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Interviews ({applications.filter(a => a.status === 'Interview Scheduled').length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('Rejected')}
                                className={`px-4 py-2 rounded-lg font-medium transition ${filterStatus === 'Rejected'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Rejected ({applications.filter(a => a.status === 'Rejected').length})
                            </button>
                        </div>
                    </div>
                )}

                {/* Applications List */}
                {!loading && (
                    <div className="space-y-4">
                        {filteredApplications.map((app) => (
                            <div key={app.id} className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900">{app.job}</h3>
                                        <p className="text-gray-600 mt-1">{app.company} • {app.location}</p>
                                        <p className="text-sm text-gray-500 mt-1">Applied on {app.appliedDate}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {app.matchScore > 0 && (
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">Match Score</p>
                                                <p className="text-2xl font-bold text-primary-600">{app.matchScore}%</p>
                                            </div>
                                        )}
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </div>
                                </div>

                                {/* AI Feedback */}
                                {app.aiFeedback && (
                                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm font-medium text-blue-900 mb-1">🤖 AI Feedback:</p>
                                        <p className="text-sm text-blue-800">{app.aiFeedback}</p>
                                    </div>
                                )}

                                {/* Cover Letter Preview */}
                                {app.coverLetter && (
                                    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <p className="text-sm font-medium text-gray-700 mb-1">📝 Cover Letter:</p>
                                        <p className="text-sm text-gray-600 line-clamp-2">{app.coverLetter}</p>
                                    </div>
                                )}

                                {/* Status Messages */}
                                {app.status === 'Rejected' && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-900 font-medium">
                                            ❌ Application was rejected {app.reviewedAt ? `on ${new Date(app.reviewedAt).toLocaleDateString()}` : ''}
                                        </p>
                                    </div>
                                )}

                                {app.status === 'Interview Scheduled' && (
                                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-900 font-medium">
                                            📅 Congratulations! You've been shortlisted for an interview.
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-3 mt-4 pt-4 border-t">
                                    {app.cvUrl && (
                                        <a
                                            href={app.cvUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
                                        >
                                            View CV
                                        </a>
                                    )}
                                    {app.status === 'Pending' && (
                                        <button
                                            onClick={() => handleWithdraw(app.id)}
                                            className="px-4 py-2 border-2 border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition"
                                        >
                                            Withdraw Application
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredApplications.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
                        <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {filterStatus === 'all' ? 'No Applications Yet' : `No ${filterStatus} Applications`}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {filterStatus === 'all'
                                ? "You haven't applied to any jobs yet. Start browsing to find your next opportunity!"
                                : `You don't have any applications with "${filterStatus}" status.`
                            }
                        </p>
                        {filterStatus === 'all' && (
                            <button
                                onClick={() => navigate('/browse-jobs')}
                                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
                            >
                                Browse Jobs
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;
