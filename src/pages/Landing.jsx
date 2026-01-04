import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Zap, MessageSquare, ArrowRight, CheckCircle, Users, Building2, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const Landing = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Upload className="w-7 h-7" />,
            title: 'AI CV Analysis',
            description: 'Advanced AI algorithms analyze CVs and match them with job requirements automatically.',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: <Zap className="w-7 h-7" />,
            title: 'Smart Matching',
            description: 'Get accurate match scores and skill gap analysis for every candidate-job pairing.',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: <MessageSquare className="w-7 h-7" />,
            title: 'AI Voice & Video Interviews',
            description: 'Conduct AI-powered voice and video interviews with real-time analysis and scoring.',
            color: 'from-orange-500 to-red-500',
        },
    ];

    const stats = [
        { number: '10K+', label: 'Active Users', icon: <Users className="w-5 h-5" /> },
        { number: '500+', label: 'Companies', icon: <Building2 className="w-5 h-5" /> },
        { number: '95%', label: 'Success Rate', icon: <TrendingUp className="w-5 h-5" /> },
    ];

    const benefits = [
        'Instant CV analysis and job matching',
        'AI-powered skill assessment',
        'Voice & Video interview automation',
        'Real-time application tracking',
        'Personalized job recommendations',
        'Detailed analytics and insights',
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
            {/* Header */}
            <motion.header 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="border-b border-primary-500 bg-white/10 backdrop-blur-md sticky top-0 z-40"
            >
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-primary-600 font-bold text-lg">AI</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">AI Recruitment</h1>
                        <Badge variant="success" className="hidden sm:flex">Beta</Badge>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/login')}
                            className="text-white hover:bg-white/10"
                        >
                            Login
                        </Button>
                        <Button
                            onClick={() => navigate('/signup')}
                            className="bg-white text-primary-600 hover:bg-gray-100"
                        >
                            Sign Up
                        </Button>
                    </div>
                </div>
            </motion.header>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 lg:py-32 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Badge variant="primary" className="mb-6 bg-white/20 text-white border-white/30">
                        🚀 Powered by Advanced AI
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        AI-Powered Recruitment
                        <br />
                        <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                            Made Simple
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-primary-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Match candidates with jobs using intelligent CV analysis, AI voice/video interviews, and automated scoring.
                        Streamline your hiring process today.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Button
                            onClick={() => navigate('/upload-cv')}
                            size="xl"
                            className="bg-white text-primary-600 hover:bg-gray-100 shadow-2xl"
                            icon={<Upload className="w-5 h-5" />}
                        >
                            Upload Your CV
                        </Button>
                        <Button
                            onClick={() => navigate('/signup')}
                            size="xl"
                            variant="outline"
                            className="border-2 border-white text-white hover:bg-white/10"
                            icon={<ArrowRight className="w-5 h-5" />}
                        >
                            Get Started Free
                        </Button>
                    </div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16"
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="flex items-center justify-center gap-2 text-white mb-2">
                                    {stat.icon}
                                    <p className="text-3xl font-bold">{stat.number}</p>
                                </div>
                                <p className="text-primary-200 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <Badge variant="primary" className="mb-4 bg-white/20 text-white border-white/30">
                        Features
                    </Badge>
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Everything You Need to Succeed
                    </h2>
                    <p className="text-primary-100 text-lg max-w-2xl mx-auto">
                        Powerful features that make recruitment effortless and effective
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card hover className="h-full bg-white/10 backdrop-blur-md border-white/20 text-center p-8">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-4 text-white`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-primary-100">
                                    {feature.description}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Benefits Section */}
            <section className="container mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Badge variant="success" className="mb-4 bg-green-500/20 text-green-200 border-green-500/30">
                            Why Choose Us
                        </Badge>
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Transform Your Hiring Process
                        </h2>
                        <p className="text-primary-100 text-lg mb-8">
                            Our AI-powered platform streamlines recruitment, saving you time and helping you find the perfect match every time.
                        </p>
                        <div className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-3 text-white"
                                >
                                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                                    <span className="text-lg">{benefit}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                            <div className="aspect-square bg-gradient-to-br from-primary-400 to-purple-600 rounded-2xl flex items-center justify-center">
                                <div className="text-center text-white">
                                    <div className="text-6xl font-bold mb-4">95%</div>
                                    <div className="text-xl">Match Accuracy</div>
                                </div>
                            </div>
                        </div>
                        {/* Floating Cards */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -top-6 -left-6 bg-white rounded-xl shadow-2xl p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">Perfect Match!</div>
                                    <div className="text-xs text-gray-600">85% compatibility</div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                            className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-2xl p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">AI Analysis</div>
                                    <div className="text-xs text-gray-600">In 2.3 seconds</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-none text-center p-12 md:p-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Join thousands of professionals and companies already using AI Recruitment
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Button
                                onClick={() => navigate('/signup')}
                                size="xl"
                                className="bg-white text-purple-600 hover:bg-gray-100"
                                icon={<ArrowRight className="w-5 h-5" />}
                            >
                                Create Free Account
                            </Button>
                            <Button
                                onClick={() => navigate('/browse-jobs')}
                                size="xl"
                                variant="outline"
                                className="border-2 border-white text-white hover:bg-white/10"
                            >
                                Browse Jobs
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="border-t border-primary-500 bg-white/5 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-primary-100 text-center md:text-left">
                            © 2025 AI Recruitment Platform. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm text-primary-200">
                            <button className="hover:text-white transition">Privacy Policy</button>
                            <button className="hover:text-white transition">Terms of Service</button>
                            <button className="hover:text-white transition">Contact Us</button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
