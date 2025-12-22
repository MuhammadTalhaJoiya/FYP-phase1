import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RecruiterJobDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [emailModalOpen, setEmailModalOpen] = useState(false);

    // Dummy candidates data for this specific job
    const candidates = [
        {
            id: 101,
            name: 'Alex Morgan',
            email: 'alex.m@example.com',
            matchScore: 92,
            appliedDate: 'Dec 19, 2025',
            status: 'Pending',
            skills: ['React', 'Node.js', 'Typescript'],
            aiAnalysis: 'Strong candidate with 5 years experience. Excellent match for Senior role.'
        },
        {
            id: 102,
            name: 'David Chen',
            email: 'david.c@example.com',
            matchScore: 88,
            appliedDate: 'Dec 18, 2025',
            status: 'Interview Scheduled',
            skills: ['React', 'AWS', 'Python'],
            aiAnalysis: 'Good technical skills, relevant industry experience.'
        },
        {
            id: 103,
            name: 'Sarah Jones',
            email: 'sarah.j@example.com',
            matchScore: 75,
            appliedDate: 'Dec 20, 2025',
            status: 'Pending',
            skills: ['Javascript', 'HTML', 'CSS'],
            aiAnalysis: 'Technically sound but lacks leadership experience required for this role.'
        }
    ];

    const sortedCandidates = [...candidates].sort((a, b) => b.matchScore - a.matchScore);

    const handleInviteClick = (candidate) => {
        setSelectedCandidate(candidate);
        setEmailModalOpen(true);
    };

    const handleSendEmail = () => {
        alert(`Invitation Email Sent to ${selectedCandidate.email}!`);
        setEmailModalOpen(false);
        // In real app, this would update status to "Interview Scheduled"
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
                <div>
                    <button onClick={() => navigate('/recruiter-dashboard')} className="text-gray-500 hover:text-gray-700 flex items-center gap-2 mb-2">
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Senior React Developer</h1>
                    <p className="text-gray-600 mt-1">Job ID: #{id} • Posted Dec 18, 2025</p>
                </div>
                <div className="flex gap-3">
                    <span className="px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg">Active</span>
                </div>
            </header>

            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Candidate Applications ({candidates.length})</h2>
                        <div className="flex gap-2">
                            <select className="border-gray-300 rounded-lg text-sm">
                                <option>Sort by Match Score</option>
                                <option>Sort by Date</option>
                            </select>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {sortedCandidates.map((candidate) => (
                            <div key={candidate.id} className="p-6 hover:bg-gray-50 transition">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${candidate.matchScore >= 90 ? 'bg-green-100 text-green-700' : candidate.matchScore >= 80 ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {candidate.matchScore}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{candidate.name}</h3>
                                            <p className="text-sm text-gray-500">{candidate.email} • Applied {candidate.appliedDate}</p>
                                            <div className="flex gap-2 mt-2">
                                                {candidate.skills.map((skill, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">{skill}</span>
                                                ))}
                                            </div>
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-100">
                                                <span className="font-semibold text-gray-900">AI Analysis: </span>
                                                {candidate.aiAnalysis}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${candidate.status === 'Interview Scheduled' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {candidate.status}
                                        </span>
                                        {candidate.status !== 'Interview Scheduled' && (
                                            <button
                                                onClick={() => handleInviteClick(candidate)}
                                                className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm"
                                            >
                                                Schedule Interview
                                            </button>
                                        )}
                                        <button className="text-sm text-gray-500 hover:text-gray-700 underline">View Full CV</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Email Modal */}
            {emailModalOpen && selectedCandidate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h3 className="text-xl font-bold text-gray-900">Schedule Interview</h3>
                            <button onClick={() => setEmailModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                <input type="text" value={selectedCandidate.email} disabled className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input type="text" defaultValue={`Interview Invitation for Senior React Developer`} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea rows="6" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" defaultValue={`Hi ${selectedCandidate.name},\n\nWe were impressed by your profile and AI match score. We would like to invite you for an interview.\n\nProposed Date: Dec 28, 2025\nTime: 10:00 AM EST\n\nPlease let us know if you are available.\n\nBest regards,\nJane Smith`} />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button onClick={() => setEmailModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
                            <button onClick={handleSendEmail} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                Send Invitation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterJobDetails;
