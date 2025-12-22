import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RecruiterDashboard = () => {
    const navigate = useNavigate();
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Track recruiter payment/subscription status
    const [isPremiumRecruiter, setIsPremiumRecruiter] = useState(() => {
        return localStorage.getItem('recruiterPremium') === 'true';
    });
    const [selectedPlan, setSelectedPlan] = useState('monthly'); // 'monthly' or 'per-post'

    // Check payment status on mount
    useEffect(() => {
        if (!isPremiumRecruiter) {
            // Show payment modal immediately if not premium
            setShowPaymentModal(true);
        }
    }, [isPremiumRecruiter]);

    // Persist premium status
    useEffect(() => {
        localStorage.setItem('recruiterPremium', isPremiumRecruiter.toString());
    }, [isPremiumRecruiter]);

    // Dummy data for jobs posted by this recruiter
    const postedJobs = [
        {
            id: 1,
            title: 'Senior React Developer',
            location: 'Remote',
            type: 'Full-time',
            postedDate: 'Dec 18, 2025',
            candidates: 12,
            interviews: 2,
            status: 'Active'
        },
        {
            id: 2,
            title: 'Junior Frontend Engineer',
            location: 'New York, NY',
            type: 'Contract',
            postedDate: 'Dec 20, 2025',
            candidates: 5,
            interviews: 0,
            status: 'Active'
        }
    ];

    const handlePostJobClick = () => {
        if (!isPremiumRecruiter) {
            setShowPaymentModal(true);
        } else {
            // Navigate to job posting form (simulated)
            alert('Job posting form would open here. (Not implemented in this demo)');
        }
    };

    const handleSubscribe = () => {
        // Simulate payment - in production, integrate with Stripe/PayPal
        setIsPremiumRecruiter(true);
        setShowPaymentModal(false);
        alert(`Subscription Successful! You now have ${selectedPlan === 'monthly' ? 'unlimited access' : 'one job posting credit'}.`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar & Navigation (simplified for demo) */}
            <div className="flex">
                <aside className="w-64 bg-white min-h-screen border-r border-gray-200 hidden md:block fixed">
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">R</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">Recruiter Portal</span>
                        </div>
                        {isPremiumRecruiter && (
                            <div className="mb-6 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-300 rounded-lg">
                                <p className="text-xs font-semibold text-purple-700 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                    Premium Account
                                </p>
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
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Post a New Job
                            </button>
                            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                Candidates
                            </button>
                        </nav>
                    </div>

                    <div className="absolute bottom-0 w-full p-6 border-t border-gray-200">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="font-semibold text-gray-600">JS</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Jane Smith</p>
                                <p className="text-xs text-gray-500">Recruiter</p>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 ml-64 p-8">
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
                            <p className="text-gray-600 mt-1">Manage your job postings and review top talent.</p>
                        </div>
                        <button
                            onClick={handlePostJobClick}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Post New Job
                        </button>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">+2 this week</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">2</h3>
                            <p className="text-gray-600 text-sm">Active Job Postings</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">+12 new</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">17</h3>
                            <p className="text-gray-600 text-sm">Total Applications</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-orange-50 rounded-lg">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">Updated just now</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">2</h3>
                            <p className="text-gray-600 text-sm">Interviews Scheduled</p>
                        </div>
                    </div>

                    {/* Active Jobs List */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900">Your Active Job Postings</h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {postedJobs.map((job) => (
                                <div key={job.id} className="p-6 hover:bg-gray-50 transition flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Posted {job.postedDate}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <span className="block text-2xl font-bold text-gray-900">{job.candidates}</span>
                                            <span className="text-xs text-gray-500 uppercase tracking-wide">Candidates</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="block text-2xl font-bold text-gray-900">{job.interviews}</span>
                                            <span className="text-xs text-gray-500 uppercase tracking-wide">Interviews</span>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/recruiter/job/${job.id}`)}
                                            className="ml-4 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium transition"
                                        >
                                            Manage Candidates
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* Recruiter Subscription Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl transform transition-all scale-100">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Choose Your Plan</h3>
                            <p className="text-gray-500 mt-2">Select a plan to start posting jobs and finding top talent.</p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div
                                onClick={() => setSelectedPlan('monthly')}
                                className={`border-2 rounded-lg p-4 cursor-pointer transition ${selectedPlan === 'monthly'
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200 hover:border-indigo-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-gray-900">Monthly Subscription</h4>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'monthly' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                                        }`}>
                                        {selectedPlan === 'monthly' && (
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 mb-2">$99<span className="text-sm text-gray-600 font-normal">/month</span></p>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Unlimited job postings
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        AI-powered candidate matching
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Priority support
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Advanced analytics
                                    </li>
                                </ul>
                            </div>

                            <div
                                onClick={() => setSelectedPlan('per-post')}
                                className={`border-2 rounded-lg p-4 cursor-pointer transition ${selectedPlan === 'per-post'
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200 hover:border-indigo-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-gray-900">Pay Per Post</h4>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'per-post' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                                        }`}>
                                        {selectedPlan === 'per-post' && (
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 mb-2">$49<span className="text-sm text-gray-600 font-normal">/post</span></p>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        One job posting
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        30-day active listing
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Candidate matching
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
                            >
                                Maybe Later
                            </button>
                            <button
                                onClick={handleSubscribe}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition"
                            >
                                Subscribe Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterDashboard;
