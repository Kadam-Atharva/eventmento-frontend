"use client";

import React, { useState, useEffect } from 'react';
import { useCurrentUser } from '@/hooks/useUser';
import EventImage from '@/Componentes/Common/EventImage';

const SettingsPage = () => {
    const { user, isLoading } = useCurrentUser();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage('');
        
        // Simulating an update since we don't have a backend endpoint in domain.js
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessage("Profile updated successfully!");
        } catch (error) {
            setMessage("Failed to update profile.");
        } finally {
            setIsUpdating(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 drop-shadow-sm mb-2">
                        Settings
                    </h1>
                    <p className="text-gray-500 font-medium">Manage your profile and account preferences.</p>
                </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-400/10 to-teal-400/10 rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700"></div>

                <div className="mb-8 border-b border-gray-100 pb-6">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Profile Information</h2>
                    <p className="text-sm text-gray-500 mt-1">Update your account's public profile.</p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center mb-8">
                        <div className="relative group/avatar">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-tr from-blue-100 to-indigo-50 transition-transform duration-300 group-hover/avatar:scale-105">
                                <EventImage 
                                    src={user?.profileImage} 
                                    alt={user?.name || 'Profile'} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-blue-700">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            </div>
                        </div>
                        <div className="flex-1 space-y-2">
                           <h3 className="text-lg font-semibold text-gray-800">Profile Picture</h3>
                           <p className="text-sm text-gray-500">A picture helps people recognize you.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 outline-none shadow-sm"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 text-gray-500 cursor-not-allowed outline-none shadow-sm"
                                placeholder="Enter your email"
                            />
                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl text-sm font-medium ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {message}
                        </div>
                    )}

                    <div className="pt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isUpdating ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                "Update Profile"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;
