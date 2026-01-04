import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, DollarSign, Users, ArrowLeft, Filter, Building2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { JobCardSkeleton } from '../components/ui/Skeleton';
import { jobsAPI } from '../lib/api';

const BrowseJobs = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState([]);

    // Fetch real jobs from backend
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const response = await jobsAPI.getAll();
                
                // Backend returns { data: { jobs: [...], pagination: {...} } }
                const jobsData = response.data?.jobs || [];
                console.log('Fetched jobs:', jobsData); // Debug log
                setJobs(jobsData);
            } catch (error) {
                console.error('Error fetching jobs:', error);
                toast.error('Failed to load jobs. Please try again.');
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job => {
        // Parse skills if they're stored as JSON string
        let jobSkills = [];
        try {
            jobSkills = typeof job.skills === 'string' ? JSON.parse(job.skills) : (job.skills || []);
        } catch (e) {
            jobSkills = [];
        }

        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            jobSkills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesType = selectedType === 'all' || job.jobType?.toLowerCase() === selectedType.toLowerCase();
        
        const matchesLocation = selectedLocation === 'all' || 
            job.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
            (selectedLocation === 'remote' && job.isRemote);
        
        return matchesSearch && matchesType && matchesLocation;
    });

    const handleApply = (jobId) => {
        // Navigate to job application page
        navigate(`/apply/${jobId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-primary-600">AI Recruitment</h1>
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate('/dashboard')}
                        icon={<ArrowLeft className="w-4 h-4" />}
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8 max-w-7xl">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <h1 className="text-4xl font-bold text-gray-900">Browse Jobs</h1>
                    <p className="text-gray-600 mt-2">Explore {jobs.length} available positions</p>
                </motion.div>

                {/* Search & Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="mb-6">
                        <div className="grid md:grid-cols-12 gap-4">
                            <div className="md:col-span-5">
                                <Input
                                    type="text"
                                    placeholder="Search jobs, companies, or skills..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    icon={<Search className="w-5 h-5" />}
                                />
                            </div>
                            <div className="md:col-span-3">
                                <Select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    <option value="all">All Types</option>
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="contract">Contract</option>
                                    <option value="internship">Internship</option>
                                    <option value="remote">Remote</option>
                                </Select>
                            </div>
                            <div className="md:col-span-3">
                                <Select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                >
                                    <option value="all">All Locations</option>
                                    <option value="remote">Remote Only</option>
                                    <option value="lahore">Lahore</option>
                                    <option value="karachi">Karachi</option>
                                    <option value="islamabad">Islamabad</option>
                                    <option value="rawalpindi">Rawalpindi</option>
                                    <option value="faisalabad">Faisalabad</option>
                                </Select>
                            </div>
                            <div className="md:col-span-1">
                                <Button className="w-full" icon={<Filter className="w-4 h-4" />}>
                                    <span className="sr-only sm:not-sr-only">Filter</span>
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Results Count */}
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-gray-600">
                        <span className="font-semibold text-gray-900">{filteredJobs.length}</span> jobs found
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Sort by:</span>
                        <Select className="w-auto">
                            <option>Most Recent</option>
                            <option>Salary (High to Low)</option>
                            <option>Most Applicants</option>
                        </Select>
                    </div>
                </div>

                {/* Job Listings */}
                <div className="space-y-4">
                    {loading ? (
                        <>
                            <JobCardSkeleton />
                            <JobCardSkeleton />
                            <JobCardSkeleton />
                        </>
                    ) : filteredJobs.length === 0 ? (
                        <Card className="text-center py-16">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                            <Button onClick={() => { setSearchQuery(''); setSelectedType('all'); setSelectedLocation('all'); }}>
                                Clear Filters
                            </Button>
                        </Card>
                    ) : (
                        filteredJobs.map((job, index) => {
                            // Parse skills if stored as JSON string
                            let jobSkills = [];
                            try {
                                jobSkills = typeof job.skills === 'string' ? JSON.parse(job.skills) : (job.skills || []);
                            } catch (e) {
                                jobSkills = [];
                            }

                            // Calculate time ago
                            const timeAgo = job.createdAt 
                                ? Math.floor((new Date() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24)) 
                                : 0;
                            const postedText = timeAgo === 0 ? 'Today' : timeAgo === 1 ? '1 day ago' : `${timeAgo} days ago`;

                            // Get company logo (first letter of company name)
                            const companyLogo = job.company?.charAt(0).toUpperCase() || '💼';

                            return (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card hover className="p-6">
                                        <div className="flex gap-4">
                                            {/* Company Logo */}
                                            <div className="flex-shrink-0">
                                                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl font-bold text-primary-700">
                                                    {companyLogo}
                                                </div>
                                            </div>

                                            {/* Job Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                                                        <p className="text-gray-600 flex items-center gap-2">
                                                            <Building2 className="w-4 h-4" />
                                                            {job.company}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Button
                                                            onClick={() => handleApply(job.id)}
                                                            icon={<ArrowRight className="w-4 h-4" />}
                                                        >
                                                            Apply Now
                                                        </Button>
                                                        {job.isPremium && (
                                                            <Badge variant="warning" className="text-xs">
                                                                ⭐ Featured
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                                                {/* Skills */}
                                                {jobSkills.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {jobSkills.slice(0, 6).map((skill, idx) => (
                                                            <Badge key={idx} variant="default">
                                                                {skill}
                                                            </Badge>
                                                        ))}
                                                        {jobSkills.length > 6 && (
                                                            <Badge variant="default" className="bg-gray-100 text-gray-600">
                                                                +{jobSkills.length - 6} more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Job Meta */}
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1.5">
                                                        <Briefcase className="w-4 h-4" />
                                                        {job.jobType || job.type || 'Full-time'}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin className="w-4 h-4" />
                                                        {job.location}
                                                        {job.isRemote && ' (Remote)'}
                                                    </span>
                                                    {job.salaryRange && (
                                                        <span className="flex items-center gap-1.5">
                                                            <DollarSign className="w-4 h-4" />
                                                            {job.salaryRange}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1.5">
                                                        <Users className="w-4 h-4" />
                                                        {job.applicationCount || 0} applicants
                                                    </span>
                                                    <span className="text-gray-400 ml-auto">Posted {postedText}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrowseJobs;
