import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Briefcase, Building } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { authAPI } from '../lib/api';

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    role: z.enum(['candidate', 'recruiter'], { required_error: 'Please select a role' }),
    agreeToTerms: z.boolean().refine(val => val === true, {
        message: 'You must agree to the terms and conditions',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

const Signup = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const [selectedRole, setSelectedRole] = useState('candidate');
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'candidate',
            agreeToTerms: false,
        },
    });

    const onSubmit = async (data) => {
        try {
            // Call backend API
            const response = await authAPI.register({
                email: data.email,
                password: data.password,
                fullName: data.name,
                role: data.role,
            });
            
            // Store user and token
            setAuth(response.data.user, response.data.token);
            
            toast.success(`🎉 Welcome aboard, ${response.data.user.fullName}!`);
            
            // Navigate based on role
            if (data.role === 'recruiter') {
                navigate('/recruiter-dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Signup error:', error);
            toast.error(error.message || 'Signup failed. Please try again.');
        }
    };

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setValue('role', role);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="inline-block p-4 bg-white rounded-2xl shadow-lg mb-4"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">AI</span>
                        </div>
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-primary-100">Join thousands of professionals finding their dream jobs</p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                I am a...
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleRoleSelect('candidate')}
                                    className={`p-4 border-2 rounded-xl cursor-pointer transition ${
                                        selectedRole === 'candidate'
                                            ? 'border-primary-600 bg-primary-50'
                                            : 'border-gray-200 hover:border-primary-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            selectedRole === 'candidate' ? 'bg-primary-100' : 'bg-gray-100'
                                        }`}>
                                            <Briefcase className={`w-5 h-5 ${
                                                selectedRole === 'candidate' ? 'text-primary-600' : 'text-gray-600'
                                            }`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">Job Seeker</p>
                                            <p className="text-xs text-gray-600">Find opportunities</p>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            selectedRole === 'candidate'
                                                ? 'border-primary-600 bg-primary-600'
                                                : 'border-gray-300'
                                        }`}>
                                            {selectedRole === 'candidate' && (
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleRoleSelect('recruiter')}
                                    className={`p-4 border-2 rounded-xl cursor-pointer transition ${
                                        selectedRole === 'recruiter'
                                            ? 'border-primary-600 bg-primary-50'
                                            : 'border-gray-200 hover:border-primary-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            selectedRole === 'recruiter' ? 'bg-primary-100' : 'bg-gray-100'
                                        }`}>
                                            <Building className={`w-5 h-5 ${
                                                selectedRole === 'recruiter' ? 'text-primary-600' : 'text-gray-600'
                                            }`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">Recruiter</p>
                                            <p className="text-xs text-gray-600">Hire talent</p>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            selectedRole === 'recruiter'
                                                ? 'border-primary-600 bg-primary-600'
                                                : 'border-gray-300'
                                        }`}>
                                            {selectedRole === 'recruiter' && (
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                            <input type="hidden" {...register('role')} />
                            {errors.role && (
                                <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>
                            )}
                        </div>

                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <Input
                                type="text"
                                placeholder="John Doe"
                                icon={<User className="w-5 h-5" />}
                                error={errors.name?.message}
                                {...register('name')}
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <Input
                                type="email"
                                placeholder="john@example.com"
                                icon={<Mail className="w-5 h-5" />}
                                error={errors.email?.message}
                                {...register('email')}
                            />
                        </div>

                        {/* Password Fields */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    icon={<Lock className="w-5 h-5" />}
                                    error={errors.password?.message}
                                    {...register('password')}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    icon={<Lock className="w-5 h-5" />}
                                    error={errors.confirmPassword?.message}
                                    {...register('confirmPassword')}
                                />
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div>
                            <label className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    {...register('agreeToTerms')}
                                />
                                <span className="text-sm text-gray-600">
                                    I agree to the{' '}
                                    <button
                                        type="button"
                                        onClick={() => toast.info('Terms & Conditions page coming soon!')}
                                        className="text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        Terms & Conditions
                                    </button>
                                    {' '}and{' '}
                                    <button
                                        type="button"
                                        onClick={() => toast.info('Privacy Policy page coming soon!')}
                                        className="text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        Privacy Policy
                                    </button>
                                </span>
                            </label>
                            {errors.agreeToTerms && (
                                <p className="text-sm text-red-600 mt-1">{errors.agreeToTerms.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            loading={isSubmitting}
                            className="w-full"
                            size="lg"
                            icon={<ArrowRight className="w-5 h-5" />}
                        >
                            Create Account
                        </Button>
                    </form>

                    {/* Sign In Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-medium text-primary-600 hover:text-primary-700"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </Card>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm text-white/80 hover:text-white"
                    >
                        ← Back to Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
