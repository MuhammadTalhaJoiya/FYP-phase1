import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BrowseJobs = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');

    // Dummy job listings
    const jobs = [
        {
            id: 1,
            title: 'Senior React Developer',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            type: 'Full-time',
            salary: '$120k - $160k',
            posted: '2 days ago',
            applicants: 45,
            skills: ['React.js', 'TypeScript', 'Node.js', 'GraphQL'],
            description: 'Build cutting-edge web applications with modern React.'
        },
        {
            id: 2,
            title: 'Full Stack Engineer',
            company: 'StartupXYZ',
            location: 'Remote',
            type: 'Full-time',
            salary: '$100k - $140k',
            posted: '1 week ago',
            applicants: 67,
            skills: ['React.js', 'Node.js', 'PostgreSQL', 'AWS'],
            description: 'Join our innovative startup to build scalable applications.'
        },
        {
            id: 3,
            title: 'Frontend Developer',
            company: 'WebSolutions Ltd',
            location: 'New York, NY',
            type: 'Contract',
            salary: '$80k - $100k',
            posted: '3 days ago',
            applicants: 32,
            skills: ['HTML', 'CSS', 'JavaScript', 'Vue.js'],
            description: 'Create beautiful and responsive user interfaces.'
        },
        {
            id: 4,
            title: 'DevOps Engineer',
            company: 'CloudTech Solutions',
            location: 'Austin, TX',
            type: 'Full-time',
            salary: '$110k - $150k',
            posted: '5 days ago',
            applicants: 28,
            skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins'],
            description: 'Manage cloud infrastructure and CI/CD pipelines.'
        },
        {
            id: 5,
            title: 'UI/UX Designer',
            company: 'DesignHub',
            location: 'Remote',
            type: 'Full-time',
            salary: '$90k - $120k',
            posted: '1 day ago',
            applicants: 54,
            skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
            description: 'Design exceptional user experiences for our products.'
        },
        {
            id: 6,
            title: 'Backend Developer',
            company: 'DataFlow Inc',
            location: 'Seattle, WA',
            type: 'Full-time',
            salary: '$95k - $130k',
            posted: '4 days ago',
            applicants: 39,
            skills: ['Python', 'Django', 'PostgreSQL', 'Redis'],
            description: 'Build robust backend systems and APIs.'
        },
        {
            id: 7,
            title: 'Mobile Developer',
            company: 'AppTech',
            location: 'Los Angeles, CA',
            type: 'Contract',
            salary: '$85k - $115k',
            posted: '6 days ago',
            applicants: 41,
            skills: ['React Native', 'iOS', 'Android', 'Firebase'],
            description: 'Develop cross-platform mobile applications.'
        },
        {
            id: 8,
            title: 'Data Scientist',
            company: 'AI Labs',
            location: 'Boston, MA',
            type: 'Full-time',
            salary: '$130k - $170k',
            posted: '2 days ago',
            applicants: 62,
            skills: ['Python', 'TensorFlow', 'SQL', 'Machine Learning'],
            description: 'Apply AI/ML to solve complex business problems.'
        }
    ];

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'all' || job.type === selectedType;
        return matchesSearch && matchesType;
    });

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
                    <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
                    <p className="text-gray-600 mt-1">Explore {jobs.length} available positions</p>
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 border mb-6">
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search jobs or companies..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                                <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="all">All Types</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Part-time">Part-time</option>
                        </select>
                        <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition">
                            Search
                        </button>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4">
                    <p className="text-gray-600">{filteredJobs.length} jobs found</p>
                </div>

                {/* Job Listings */}
                <div className="space-y-4">
                    {filteredJobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                    <p className="text-gray-600 mt-1">{job.company} • {job.location}</p>
                                </div>
                                <button
                                    onClick={() => navigate('/upload-cv')}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
                                >
                                    Apply Now
                                </button>
                            </div>

                            <p className="text-gray-700 mb-4">{job.description}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {job.skills.map((skill, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {job.type}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {job.salary}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        {job.applicants} applicants
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500">Posted {job.posted}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrowseJobs;
