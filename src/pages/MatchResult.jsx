import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const MatchResult = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Mock data
    const matchData = {
        jobTitle: 'Senior React Developer',
        company: 'TechCorp Inc.',
        matchScore: 85,
        matchedSkills: ['React.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Node.js', 'REST APIs', 'Git', 'Agile'],
        missingSkills: ['GraphQL', 'Docker', 'Kubernetes', 'AWS'],
        aiFeedback: 'Your experience in React and modern JavaScript frameworks aligns well with this role. You demonstrate strong frontend development skills. Consider learning GraphQL and containerization technologies to become a perfect match.',
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent Match';
        if (score >= 60) return 'Good Match';
        return 'Fair Match';
    };

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

            <div className="container mx-auto px-6 py-12 max-w-5xl">
                <div className="space-y-6">
                    {/* Header Card */}
                    <div className="bg-white rounded-xl shadow-sm p-8 border">
                        <h2 className="text-3xl font-bold text-gray-900">{matchData.jobTitle}</h2>
                        <p className="text-lg text-gray-600 mt-1">{matchData.company}</p>

                        <div className="mt-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Overall Match Score</span>
                                <span className={`text-3xl font-bold ${getScoreColor(matchData.matchScore)}`}>
                                    {matchData.matchScore}%
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${matchData.matchScore >= 80 ? 'bg-green-500' :
                                        matchData.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                    style={{ width: `${matchData.matchScore}%` }}
                                ></div>
                            </div>

                            <p className="text-sm text-gray-600 text-right">{getScoreLabel(matchData.matchScore)}</p>
                        </div>
                    </div>

                    {/* Skills Comparison */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Matched Skills */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border">
                            <div className="flex items-center gap-2 mb-4">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900">Matched Skills</h3>
                            </div>
                            <div className="space-y-2">
                                {matchData.matchedSkills.map((skill, index) => (
                                    <div key={index} className="flex items-center gap-2 text-gray-700">
                                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Missing Skills */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border">
                            <div className="flex items-center gap-2 mb-4">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900">Skills to Develop</h3>
                            </div>
                            <div className="space-y-2">
                                {matchData.missingSkills.map((skill, index) => (
                                    <div key={index} className="flex items-center gap-2 text-gray-700">
                                        <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span>{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* AI Feedback */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Feedback & Recommendations</h3>
                        <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded">
                            <p className="text-gray-700 leading-relaxed">{matchData.aiFeedback}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex gap-3">
                                <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <div>
                                        <p className="text-sm text-blue-900 font-medium">Next Steps</p>
                                        <p className="text-sm text-blue-800 mt-1">
                                            Your profile has been sent to the recruiter. If your profile is selected, the recruiter will <strong>email you</strong> with the scheduled interview date and details.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition"
                        >
                            Back to Dashboard
                        </button>
                    </div>

                    {/* Additional Actions */}
                    <div className="flex justify-center gap-6 pt-4">
                        <button className="text-gray-600 hover:text-gray-900 font-medium">
                            Save for Later
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 font-medium">
                            Share Result
                        </button>
                        <button className="text-red-600 hover:text-red-700 font-medium">
                            Not Interested
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchResult;
