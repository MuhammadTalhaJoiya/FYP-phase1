import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
            {/* Header */}
            <header className="border-b border-primary-500 bg-white/10 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">AI Recruitment</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-4 py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100 transition"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                    AI-Powered Recruitment <br />Made Simple
                </h1>
                <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                    Match candidates with jobs using intelligent CV analysis and automated AI interviews.
                    Streamline your hiring process today.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                    <button
                        onClick={() => navigate('/upload-cv')}
                        className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
                    >
                        Upload Your CV
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-8 py-4 bg-primary-500 text-white rounded-lg font-semibold text-lg hover:bg-primary-400 transition shadow-lg"
                    >
                        Get Started Free
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition">
                        <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3">AI CV Analysis</h3>
                        <p className="text-primary-100">
                            Advanced AI algorithms analyze CVs and match them with job requirements automatically.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition">
                        <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3">Smart Matching</h3>
                        <p className="text-primary-100">
                            Get accurate match scores and skill gap analysis for every candidate-job pairing.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition">
                        <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3">Automated Interviews</h3>
                        <p className="text-primary-100">
                            Conduct AI-driven voice interviews and receive detailed candidate assessments.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-primary-500 bg-white/5 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-8 text-center">
                    <p className="text-primary-100">© 2025 AI Recruitment Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
