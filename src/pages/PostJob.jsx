import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Calendar, X, Plus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { jobsAPI } from '../lib/api';

// Job posting validation schema
const jobSchema = z.object({
    title: z.string().min(5, 'Job title must be at least 5 characters'),
    company: z.string().min(2, 'Company name is required'),
    location: z.string().min(2, 'Location is required'),
    jobType: z.enum(['full-time', 'part-time', 'contract', 'internship', 'remote']),
    experienceLevel: z.enum(['entry', 'intermediate', 'senior', 'executive']),
    salaryRange: z.string().optional(),
    description: z.string().min(50, 'Description must be at least 50 characters'),
    requirements: z.string().min(20, 'Requirements must be at least 20 characters'),
    responsibilities: z.string().min(20, 'Responsibilities must be at least 20 characters'),
    benefits: z.string().optional(),
    applicationDeadline: z.string().optional(),
    isRemote: z.boolean().default(false),
});

const PostJob = () => {
    const navigate = useNavigate();
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch
    } = useForm({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            title: '',
            company: '',
            location: '',
            jobType: 'full-time',
            experienceLevel: 'intermediate',
            salaryRange: '',
            description: '',
            requirements: '',
            responsibilities: '',
            benefits: '',
            applicationDeadline: '',
            isRemote: false,
        },
    });

    const isRemote = watch('isRemote');

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (skillInput.trim() && !skills.includes(skillInput.trim())) {
            setSkills([...skills, skillInput.trim()]);
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const onSubmit = async (data) => {
        if (skills.length === 0) {
            toast.error('Please add at least one required skill');
            return;
        }

        try {
            const jobData = {
                ...data,
                skills: skills,
            };

            const response = await jobsAPI.create(jobData);
            
            toast.success('🎉 Job posted successfully!');
            setTimeout(() => {
                navigate('/recruiter-dashboard');
            }, 1500);
        } catch (error) {
            console.error('Error posting job:', error);
            toast.error(error.message || 'Failed to post job. Please check your subscription status.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Button
                        variant="outline"
                        onClick={() => navigate('/recruiter-dashboard')}
                        icon={<ArrowLeft className="w-4 h-4" />}
                        className="mb-4"
                    >
                        Back to Dashboard
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
                    <p className="text-gray-600">Fill in the details to attract the best candidates</p>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-indigo-600" />
                                    Basic Information
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Job Title *
                                    </label>
                                    <Input
                                        {...register('title')}
                                        placeholder="e.g., Senior React Developer"
                                        error={errors.title?.message}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company Name *
                                        </label>
                                        <Input
                                            {...register('company')}
                                            placeholder="e.g., Tech Solutions Inc."
                                            error={errors.company?.message}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Location *
                                        </label>
                                        <Input
                                            {...register('location')}
                                            placeholder="e.g., Karachi, Pakistan"
                                            error={errors.location?.message}
                                            icon={<MapPin className="w-4 h-4" />}
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Job Type *
                                        </label>
                                        <select
                                            {...register('jobType')}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="full-time">Full-time</option>
                                            <option value="part-time">Part-time</option>
                                            <option value="contract">Contract</option>
                                            <option value="internship">Internship</option>
                                            <option value="remote">Remote</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Experience Level *
                                        </label>
                                        <select
                                            {...register('experienceLevel')}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="entry">Entry Level</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="senior">Senior</option>
                                            <option value="executive">Executive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Salary Range
                                        </label>
                                        <Input
                                            {...register('salaryRange')}
                                            placeholder="e.g., Rs. 80,000 - Rs. 120,000"
                                            icon={<DollarSign className="w-4 h-4" />}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Application Deadline
                                        </label>
                                        <Input
                                            {...register('applicationDeadline')}
                                            type="date"
                                            icon={<Calendar className="w-4 h-4" />}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        {...register('isRemote')}
                                        id="isRemote"
                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor="isRemote" className="text-sm text-gray-700">
                                        This is a remote position
                                    </label>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="space-y-4 pt-6 border-t border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">Required Skills *</h2>
                                
                                <div className="flex gap-2">
                                    <Input
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleAddSkill(e);
                                            }
                                        }}
                                        placeholder="e.g., React, Node.js, TypeScript"
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddSkill}
                                        icon={<Plus className="w-4 h-4" />}
                                    >
                                        Add
                                    </Button>
                                </div>

                                {skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSkill(skill)}
                                                    className="hover:text-indigo-900"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Job Details */}
                            <div className="space-y-4 pt-6 border-t border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Job Description *
                                    </label>
                                    <textarea
                                        {...register('description')}
                                        rows={4}
                                        placeholder="Describe the role, company culture, and what makes this opportunity unique..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Requirements *
                                    </label>
                                    <textarea
                                        {...register('requirements')}
                                        rows={4}
                                        placeholder="List the qualifications, education, certifications, and experience needed..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    {errors.requirements && (
                                        <p className="mt-1 text-sm text-red-600">{errors.requirements.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Responsibilities *
                                    </label>
                                    <textarea
                                        {...register('responsibilities')}
                                        rows={4}
                                        placeholder="Outline the day-to-day tasks and key responsibilities..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    {errors.responsibilities && (
                                        <p className="mt-1 text-sm text-red-600">{errors.responsibilities.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Benefits (Optional)
                                    </label>
                                    <textarea
                                        {...register('benefits')}
                                        rows={3}
                                        placeholder="Health insurance, flexible hours, professional development opportunities..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-4 pt-6 border-t border-gray-200">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/recruiter-dashboard')}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                >
                                    {isSubmitting ? 'Posting Job...' : 'Post Job'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default PostJob;

