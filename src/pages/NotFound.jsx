import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                {/* 404 Text */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="mb-8"
                >
                    <h1 className="text-9xl font-bold text-white mb-4">404</h1>
                    <div className="text-6xl mb-4">🔍</div>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                >
                    <h2 className="text-3xl font-bold text-white mb-3">Page Not Found</h2>
                    <p className="text-xl text-primary-100 mb-2">
                        Oops! The page you're looking for doesn't exist.
                    </p>
                    <p className="text-primary-200">
                        It might have been moved or deleted.
                    </p>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-4 justify-center flex-wrap"
                >
                    <Button
                        onClick={() => navigate('/')}
                        size="lg"
                        className="bg-white text-primary-600 hover:bg-gray-100"
                        icon={<Home className="w-5 h-5" />}
                    >
                        Go Home
                    </Button>
                    <Button
                        onClick={() => navigate(-1)}
                        size="lg"
                        variant="outline"
                        className="border-2 border-white text-white hover:bg-white/10"
                        icon={<ArrowLeft className="w-5 h-5" />}
                    >
                        Go Back
                    </Button>
                    <Button
                        onClick={() => navigate('/browse-jobs')}
                        size="lg"
                        variant="ghost"
                        className="text-white hover:bg-white/10"
                        icon={<Search className="w-5 h-5" />}
                    >
                        Browse Jobs
                    </Button>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute top-20 left-10 text-6xl opacity-20"
                >
                    📄
                </motion.div>
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        rotate: [0, -5, 5, 0],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.5,
                    }}
                    className="absolute bottom-20 right-10 text-6xl opacity-20"
                >
                    💼
                </motion.div>
            </motion.div>
        </div>
    );
};

export default NotFound;

