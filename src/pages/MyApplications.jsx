import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyApplications = () => {
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState('all');

    // Dummy applications data
    const applications = [
        {
            id: 1,
            job: 'Senior React Developer',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            appliedDate: 'Dec 15, 2025',
            status: 'Under Review',
            matchScore: 85,
            timeline: [
                { step: 'Applied', date: 'Dec 15, 2025', completed: true },
                { step: 'CV Screening', date: 'Dec 16, 2025', completed: true },
                { step: 'Interview', date: 'Pending', completed: false },
                { step: 'Offer', date: 'Pending', completed: false }
            ]
        },
        {
            id: 2,
            job: 'Full Stack Engineer',
            company: 'StartupXYZ',
            location: 'Remote',
            appliedDate: 'Dec 12, 2025',
            status: 'Interview Scheduled',
            matchScore: 78,
            interviewDate: 'Dec 25, 2025 at 2:00 PM',
            timeline: [
                { step: 'Applied', date: 'Dec 12, 2025', completed: true },
                { step: 'CV Screening', date: 'Dec 13, 2025', completed: true },
                { step: 'Interview', date: 'Dec 25, 2025', completed: false },
                { step: 'Offer', date: 'Pending', completed: false }
            ]
        },
        {
            id: 3,
            job: 'Frontend Developer',
            company: 'WebSolutions Ltd',
            location: 'New York, NY',
            appliedDate: 'Dec 10, 2025',
            status: 'Pending',
            matchScore: 72,
            timeline: [
                { step: 'Applied', date: 'Dec 10, 2025', completed: true },
                { step: 'CV Screening', date: 'Pending', completed: false },
                { step: 'Interview', date: 'Pending', completed: false },
                { step: 'Offer', date: 'Pending', completed: false }
            ]
        },
        {
            id: 4,
            job: 'DevOps Engineer',
            company: 'CloudTech Solutions',
            location: 'Austin, TX',
            appliedDate: 'Dec 8, 2025',
            status: 'Rejected',
            matchScore: 65,
            timeline: [
                { step: 'Applied', date: 'Dec 8, 2025', completed: true },
                { step: 'CV Screening', date: 'Dec 9, 2025', completed: true },
                { step: 'Rejected', date: 'Dec 10, 2025', completed: true }
            ]
        },
        {
            id: 5,
            job: 'UI/UX Designer',
            company: 'DesignHub',
            location: 'Remote',
            appliedDate: 'Dec 18, 2025',
            status: 'Shortlisted',
            matchScore: 88,
            timeline: [
                { step: 'Applied', date: 'Dec 18, 2025', completed: true },
                { step: 'CV Screening', date: 'Dec 19, 2025', completed: true },
                { step: 'Shortlisted', date: 'Dec 20, 2025', completed: true },
                { step: 'Interview', date: 'Pending', completed: false }
            ]
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Shortlisted': return 'bg-green-100 text-green-700';
            case 'Interview Scheduled': return 'bg-blue-100 text-blue-700';
            case 'Under Review': return 'bg-yellow-100 text-yellow-700';
            case 'Pending': return 'bg-gray-100 text-gray-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
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
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                    <p className="text-gray-600 mt-1">Track all your job applications in one place</p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4 border">
                        <p className="text-sm text-gray-600">Total Applications</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{applications.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 border">
                        <p className="text-sm text-gray-600">Under Review</p>
                        <p className="text-2xl font-bold text-yellow-600 mt-1">
                            {applications.filter(a => a.status === 'Under Review').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 border">
                        <p className="text-sm text-gray-600">Interviews</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">
                            {applications.filter(a => a.status === 'Interview Scheduled').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 border">
                        <p className="text-sm text-gray-600">Shortlisted</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                            {applications.filter(a => a.status === 'Shortlisted').length}
                        </p>
                    </div>
                </div>

                {/* Filters */}
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
                            onClick={() => setFilterStatus('Under Review')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filterStatus === 'Under Review'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Under Review
                        </button>
                        <button
                            onClick={() => setFilterStatus('Interview Scheduled')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filterStatus === 'Interview Scheduled'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Interviews
                        </button>
                        <button
                            onClick={() => setFilterStatus('Shortlisted')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filterStatus === 'Shortlisted'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Shortlisted
                        </button>
                        <button
                            onClick={() => setFilterStatus('Pending')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filterStatus === 'Pending'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Pending
                        </button>
                    </div>
                </div>

                {/* Applications List */}
                <div className="space-y-4">
                    {filteredApplications.map((app) => (
                        <div key={app.id} className="bg-white rounded-xl shadow-sm p-6 border">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900">{app.job}</h3>
                                    <p className="text-gray-600 mt-1">{app.company} • {app.location}</p>
                                    <p className="text-sm text-gray-500 mt-1">Applied on {app.appliedDate}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Match Score</p>
                                        <p className="text-2xl font-bold text-primary-600">{app.matchScore}%</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>

                            {app.interviewDate && (
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-900 font-medium">
                                        📅 Interview scheduled for {app.interviewDate}
                                    </p>
                                </div>
                            )}

                            {/* Timeline */}
                            <div className="border-t pt-4">
                                <p className="text-sm font-medium text-gray-700 mb-3">Application Timeline</p>
                                <div className="flex items-center gap-2">
                                    {app.timeline.map((step, idx) => (
                                        <React.Fragment key={idx}>
                                            <div className="flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'
                                                    }`}>
                                                    {step.completed ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <span className="text-xs">{idx + 1}</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-600 mt-1 text-center">{step.step}</p>
                                                <p className="text-xs text-gray-400">{step.date}</p>
                                            </div>
                                            {idx < app.timeline.length - 1 && (
                                                <div className={`flex-1 h-1 ${step.completed ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4 pt-4 border-t">
                                <button
                                    onClick={() => navigate(`/match-result/${app.id}`)}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
                                >
                                    View Details
                                </button>
                                <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
                                    Withdraw Application
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredApplications.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-600">No applications found in this category</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;
