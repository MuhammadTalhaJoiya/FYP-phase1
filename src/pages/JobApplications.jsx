import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Mail, Phone, MapPin, FileText, TrendingUp, Calendar, Check, X, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { applicationsAPI, jobsAPI } from '../lib/api';

const JobApplications = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchJobAndApplications();
    }, [jobId, filter]);

    const fetchJobAndApplications = async () => {
        try {
            setLoading(true);
            
            // Fetch job details
            const jobResponse = await jobsAPI.getById(jobId);
            setJob(jobResponse.data);

            // Fetch applications for this job
            const params = filter !== 'all' ? { status: filter } : {};
            const appResponse = await applicationsAPI.getForJob(jobId, params);
            setApplications(appResponse.data?.applications || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const updateApplicationStatus = async (applicationId, newStatus) => {
        try {
            await applicationsAPI.updateStatus(applicationId, { status: newStatus });
            toast.success(`Application ${newStatus} successfully`);
            fetchJobAndApplications();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update application status');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'default',
            reviewing: 'info',
            shortlisted: 'success',
            interview: 'primary',
            accepted: 'success',
            rejected: 'error'
        };
        return colors[status] || 'default';
    };

    const getMatchScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        reviewing: applications.filter(a => a.status === 'reviewing').length,
        shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" onClick={() => navigate('/recruiter-dashboard')} size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
                {/* Job Info */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <Card className="p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                    {job?.title}
                                </h1>
                                <p className="text-gray-600">{job?.company} • {job?.location}</p>
                            </div>
                            <Badge variant="success" className="flex-shrink-0">
                                <Users className="w-4 h-4 mr-1" />
                                {applications.length} Applications
                            </Badge>
                        </div>
                    </Card>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card className="p-4 hover:shadow-md transition-shadow">
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total Applications</div>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-shadow">
                        <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
                        <div className="text-sm text-gray-600">Pending Review</div>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-shadow">
                        <div className="text-2xl font-bold text-yellow-600">{stats.reviewing}</div>
                        <div className="text-sm text-gray-600">Under Review</div>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-shadow">
                        <div className="text-2xl font-bold text-green-600">{stats.shortlisted}</div>
                        <div className="text-sm text-gray-600">Shortlisted</div>
                    </Card>
                </div>

                {/* Filter */}
                <Card className="p-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={filter === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('all')}
                        >
                            All
                        </Button>
                        <Button
                            variant={filter === 'pending' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('pending')}
                        >
                            Pending
                        </Button>
                        <Button
                            variant={filter === 'reviewing' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('reviewing')}
                        >
                            Reviewing
                        </Button>
                        <Button
                            variant={filter === 'shortlisted' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('shortlisted')}
                        >
                            Shortlisted
                        </Button>
                        <Button
                            variant={filter === 'interview' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('interview')}
                        >
                            Interview
                        </Button>
                    </div>
                </Card>

                {/* Applications List */}
                {applications.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                        <p className="text-gray-600">
                            {filter === 'all' 
                                ? 'No candidates have applied to this job yet.' 
                                : `No applications with status "${filter}".`}
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {applications.map((application) => (
                            <motion.div
                                key={application.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card className="p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Candidate Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                                                        {application.candidate?.fullName?.charAt(0) || 'C'}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900">
                                                            {application.candidate?.fullName || 'Candidate'}
                                                        </h3>
                                                        <Badge variant={getStatusColor(application.status)} className="mt-1">
                                                            {application.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                {application.matchScore && (
                                                    <div className="text-right">
                                                        <div className={`text-2xl font-bold ${getMatchScoreColor(application.matchScore)}`}>
                                                            {application.matchScore}%
                                                        </div>
                                                        <div className="text-xs text-gray-500">Match Score</div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Contact Info */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail className="w-4 h-4" />
                                                    {application.candidate?.email || 'N/A'}
                                                </div>
                                                {application.candidate?.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Phone className="w-4 h-4" />
                                                        {application.candidate.phone}
                                                    </div>
                                                )}
                                                {application.candidate?.location && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <MapPin className="w-4 h-4" />
                                                        {application.candidate.location}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4" />
                                                    Applied: {new Date(application.appliedAt).toLocaleDateString()}
                                                </div>
                                            </div>

                                            {/* Cover Letter */}
                                            {application.coverLetter && (
                                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                                    <p className="text-sm text-gray-700 line-clamp-3">
                                                        {application.coverLetter}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex flex-wrap gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => window.open(application.cvUrl, '_blank')}
                                                >
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    View CV
                                                </Button>
                                                {application.status === 'pending' && (
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        onClick={() => updateApplicationStatus(application.id, 'reviewing')}
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Review
                                                    </Button>
                                                )}
                                                {['pending', 'reviewing'].includes(application.status) && (
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        onClick={() => updateApplicationStatus(application.id, 'shortlisted')}
                                                    >
                                                        <Check className="w-4 h-4 mr-2" />
                                                        Shortlist
                                                    </Button>
                                                )}
                                                {application.status === 'shortlisted' && (
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        onClick={() => updateApplicationStatus(application.id, 'interview')}
                                                    >
                                                        <Calendar className="w-4 h-4 mr-2" />
                                                        Schedule Interview
                                                    </Button>
                                                )}
                                                {!['accepted', 'rejected'].includes(application.status) && (
                                                    <Button
                                                        size="sm"
                                                        variant="error"
                                                        onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                                    >
                                                        <X className="w-4 h-4 mr-2" />
                                                        Reject
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobApplications;

