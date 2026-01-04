import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'sonner';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-gray-900 text-white py-4 shadow-lg">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center font-bold">
                            {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Admin Panel</h1>
                            {user?.fullName && <p className="text-xs text-gray-400">{user.fullName}</p>}
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            logout();
                            toast.success('Logged out successfully');
                            navigate('/');
                        }} 
                        className="text-sm text-gray-400 hover:text-white"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Welcome, {user?.fullName?.split(' ')[0] || 'Admin'}! 👋
                </h2>

                {/* KPI Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-500">Total Users (Candidates)</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">1,248</p>
                        <span className="text-xs text-green-600 font-medium">↑ 12% this month</span>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-500">Recruiters</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">86</p>
                        <span className="text-xs text-green-600 font-medium">↑ 4 new requests</span>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-500">Jobs Posted</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">342</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-500">Revenue (Simulated)</p>
                        <p className="text-3xl font-bold text-indigo-600 mt-2">$24,500</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* User Management */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Recent Users</h3>
                            <button className="text-indigo-600 text-sm font-medium hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">User {i}</p>
                                            <p className="text-xs text-gray-500">user{i}@example.com</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Active</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recruiter Management */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Recruiter Status</h3>
                            <button className="text-indigo-600 text-sm font-medium hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">TechCorp Inc.</p>
                                    <p className="text-xs text-gray-500">Premium Plan</p>
                                </div>
                                <span className="text-sm font-bold text-gray-900">$490.00</span>
                            </div>
                            <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">StartupXYZ</p>
                                    <p className="text-xs text-gray-500">Pay-per-post</p>
                                </div>
                                <span className="text-sm font-bold text-gray-900">$49.00</span>
                            </div>
                            <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">WebSolutions</p>
                                    <p className="text-xs text-gray-500">Pay-per-post</p>
                                </div>
                                <span className="text-sm font-bold text-gray-900">$147.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
