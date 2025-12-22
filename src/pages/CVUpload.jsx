import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CVUpload = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [step, setStep] = useState(1);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    // Track CV analyses with localStorage persistence
    const [analysesLeft, setAnalysesLeft] = useState(() => {
        const stored = localStorage.getItem('candidateAnalysesLeft');
        return stored !== null ? parseInt(stored, 10) : 10;
    });
    const [isPremiumCandidate, setIsPremiumCandidate] = useState(() => {
        return localStorage.getItem('candidatePremium') === 'true';
    });

    // Persist analyses count to localStorage
    useEffect(() => {
        localStorage.setItem('candidateAnalysesLeft', analysesLeft.toString());
    }, [analysesLeft]);

    // Persist premium status to localStorage
    useEffect(() => {
        localStorage.setItem('candidatePremium', isPremiumCandidate.toString());
    }, [isPremiumCandidate]);

    // Dummy job postings from recruiters
    const jobPostings = [
        {
            id: 1,
            title: 'Senior React Developer',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            type: 'Full-time',
            salary: '$120k - $160k',
            postedBy: 'Sarah Johnson',
            postedDate: '2 days ago',
            description: 'We are seeking an experienced React developer to join our growing team and build cutting-edge web applications.',
            requirements: [
                '5+ years of experience with React.js',
                'Strong knowledge of TypeScript',
                'Experience with state management (Redux, Context API)',
                'Familiarity with modern build tools (Webpack, Vite)',
                'Experience with REST APIs and GraphQL',
                'Strong problem-solving skills'
            ],
            skills: ['React.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Node.js', 'GraphQL', 'REST APIs', 'Git']
        },
        {
            id: 2,
            title: 'Full Stack Engineer',
            company: 'StartupXYZ',
            location: 'Remote',
            type: 'Full-time',
            salary: '$100k - $140k',
            postedBy: 'Michael Chen',
            postedDate: '1 week ago',
            description: 'Join our innovative startup to build scalable full-stack applications using modern technologies.',
            requirements: [
                '3+ years of full-stack development',
                'Proficiency in React and Node.js',
                'Experience with databases (PostgreSQL, MongoDB)',
                'Knowledge of cloud platforms (AWS, Azure)',
                'Strong understanding of RESTful APIs',
                'Excellent communication skills'
            ],
            skills: ['React.js', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'TypeScript']
        },
        {
            id: 3,
            title: 'Frontend Developer',
            company: 'WebSolutions Ltd',
            location: 'New York, NY',
            type: 'Contract',
            salary: '$80k - $100k',
            postedBy: 'Emily Davis',
            postedDate: '3 days ago',
            description: 'Looking for a talented frontend developer to create beautiful and responsive user interfaces.',
            requirements: [
                '2+ years of frontend development',
                'Strong HTML, CSS, JavaScript skills',
                'Experience with React or Vue.js',
                'Understanding of responsive design',
                'Portfolio of previous work',
                'Attention to detail'
            ],
            skills: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Tailwind CSS', 'Figma', 'Git', 'Responsive Design']
        },
        {
            id: 4,
            title: 'DevOps Engineer',
            company: 'CloudTech Solutions',
            location: 'Austin, TX',
            type: 'Full-time',
            salary: '$110k - $150k',
            postedBy: 'James Wilson',
            postedDate: '5 days ago',
            description: 'Seeking a DevOps engineer to manage our cloud infrastructure and CI/CD pipelines.',
            requirements: [
                '4+ years of DevOps experience',
                'Strong knowledge of AWS/Azure',
                'Experience with Docker and Kubernetes',
                'Proficiency in scripting (Python, Bash)',
                'CI/CD pipeline management',
                'Infrastructure as Code (Terraform, CloudFormation)'
            ],
            skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Python', 'Bash', 'CI/CD']
        }
    ];

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
    };

    const handleContinueToJobs = () => {
        if (file) setStep(2);
    };

    const handleSelectJob = (job) => {
        setSelectedJob(job);
    };

    const handleSubmit = async () => {
        if (!file || !selectedJob) return;

        // Check if user has analyses left or is premium
        if (!isPremiumCandidate && analysesLeft <= 0) {
            setShowPaymentModal(true);
            return;
        }

        setLoading(true);
        setTimeout(() => {
            // Decrement analysis count for non-premium users
            if (!isPremiumCandidate) {
                setAnalysesLeft(prev => prev - 1);
            }
            navigate(`/match-result/${selectedJob.id}`, { state: { job: selectedJob } });
        }, 3000);
    };

    const handlePayment = () => {
        // Simulate payment - in production, integrate with Stripe/PayPal
        setIsPremiumCandidate(true);
        setShowPaymentModal(false);
        alert('Payment Successful! You now have unlimited CV analyses.');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-primary-600">AI Recruitment</h1>
                    <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">← Back</button>
                </div>
            </header>

            <div className="container mx-auto px-6 py-12 max-w-5xl">
                {/* Progress Steps */}
                <div className="mb-8 flex items-center justify-center">
                    <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full font-semibold flex items-center justify-center ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}`}>1</div>
                        <span className={`ml-3 font-medium ${step >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>Upload CV</span>
                    </div>
                    <div className={`w-24 h-1 mx-4 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                    <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full font-semibold flex items-center justify-center ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}`}>2</div>
                        <span className={`ml-3 font-medium ${step >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>Select Job</span>
                    </div>
                    <div className="w-24 h-1 bg-gray-300 mx-4"></div>
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 font-semibold flex items-center justify-center">3</div>
                        <span className="ml-3 font-medium text-gray-500">Results</span>
                    </div>
                </div>

                {/* Usage Limit Banner */}
                <div className={`mb-8 border rounded-lg p-4 flex items-center justify-between ${isPremiumCandidate
                    ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200'
                    : analysesLeft > 3
                        ? 'bg-blue-50 border-blue-200'
                        : analysesLeft > 0
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-red-50 border-red-200'
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isPremiumCandidate
                            ? 'bg-purple-100 text-purple-600'
                            : analysesLeft > 0
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-red-100 text-red-600'
                            }`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isPremiumCandidate ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                )}
                            </svg>
                        </div>
                        <div>
                            {isPremiumCandidate ? (
                                <>
                                    <p className="text-purple-900 font-medium">Premium Member - Unlimited Analyses</p>
                                    <p className="text-xs text-purple-700">You have unlimited access to CV analysis!</p>
                                </>
                            ) : analysesLeft > 0 ? (
                                <>
                                    <p className={`font-medium ${analysesLeft > 3 ? 'text-blue-900' : 'text-yellow-900'}`}>
                                        Free Plan: {analysesLeft} CV Analyses Remaining
                                    </p>
                                    <p className={`text-xs ${analysesLeft > 3 ? 'text-blue-700' : 'text-yellow-700'}`}>
                                        You can analyze your CV against 10 job postings for free.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-red-900 font-medium">Free Limit Reached</p>
                                    <p className="text-xs text-red-700">Upgrade to continue analyzing your CV.</p>
                                </>
                            )}
                        </div>
                    </div>
                    {!isPremiumCandidate && analysesLeft <= 3 && (
                        <button
                            onClick={() => setShowPaymentModal(true)}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 transition"
                        >
                            Upgrade Now
                        </button>
                    )}
                </div>

                {/* Step 1: Upload CV */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-8 border">
                            <h2 className="text-2xl font-bold mb-2">Upload Your CV</h2>
                            <p className="text-gray-600 mb-6">Upload your resume to match with available job postings</p>

                            <div onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)}
                                className={`border-2 border-dashed rounded-xl p-12 text-center transition ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}`}>
                                <input type="file" id="file-upload" accept=".pdf,.doc,.docx" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} className="hidden" />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    {file ? (
                                        <div className="flex flex-col items-center">
                                            <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-lg font-medium">{file.name}</p>
                                            <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <p className="text-lg font-medium text-gray-700">Drag & drop your CV here</p>
                                            <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                                            <p className="text-xs text-gray-400 mt-2">PDF, DOC, DOCX (Max 5MB)</p>
                                        </div>
                                    )}
                                </label>
                            </div>
                            {file && <button type="button" onClick={() => setFile(null)} className="mt-4 text-sm text-red-600">Remove file</button>}
                        </div>

                        <button onClick={handleContinueToJobs} disabled={!file} className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            Continue to Job Selection →
                        </button>
                    </div>
                )}

                {/* Step 2: Select Job */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border">
                            <h2 className="text-2xl font-bold mb-2">Select a Job Posting</h2>
                            <p className="text-gray-600">Choose a job to match your CV against ({jobPostings.length} available positions)</p>
                        </div>

                        <div className="grid gap-4">
                            {jobPostings.map((job) => (
                                <div key={job.id} onClick={() => handleSelectJob(job)}
                                    className={`bg-white rounded-xl shadow-sm p-6 border-2 cursor-pointer transition hover:shadow-md ${selectedJob?.id === job.id ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                            <p className="text-gray-600 mt-1">{job.company} • {job.location}</p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedJob?.id === job.id ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}`}>
                                            {selectedJob?.id === job.id && (
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{job.type}</span>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{job.salary}</span>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Posted {job.postedDate}</span>
                                    </div>

                                    <p className="text-gray-700 mb-3">{job.description}</p>

                                    <div className="border-t pt-3">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {job.skills.slice(0, 6).map((skill, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{skill}</span>
                                            ))}
                                            {job.skills.length > 6 && <span className="px-2 py-1 text-gray-500 text-xs">+{job.skills.length - 6} more</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50">
                                ← Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedJob || loading || analysesLeft <= 0}
                                className="flex-1 bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analyzing...
                                    </span>
                                ) : analysesLeft > 0 ? 'Analyze CV & Match →' : 'Limit Reached'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Candidate Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl transform transition-all scale-100">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Upgrade to Premium</h3>
                            <p className="text-gray-500 mt-2">You've used all your free CV analyses. Upgrade to continue!</p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="border-2 border-purple-500 bg-purple-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-gray-900">Unlimited Plan</h4>
                                    <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full font-semibold">BEST VALUE</span>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 mb-1">$19.99<span className="text-sm text-gray-600 font-normal">/month</span></p>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Unlimited CV analyses
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Priority matching
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Advanced insights
                                    </li>
                                </ul>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-bold text-gray-900 mb-2">Pay as you go</h4>
                                <p className="text-2xl font-bold text-gray-900 mb-1">$9.99<span className="text-sm text-gray-600 font-normal"> for 10 analyses</span></p>
                                <p className="text-xs text-gray-600">One-time purchase, no subscription</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePayment}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition"
                            >
                                Upgrade Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CVUpload;
