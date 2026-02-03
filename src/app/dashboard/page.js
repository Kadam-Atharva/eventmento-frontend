'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from "react-oidc-context";
import { listEvents } from '@/domain/domain';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
    const auth = useAuth();
    const [recentEvents, setRecentEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecentEvents = async () => {
             if (auth.isAuthenticated && auth.user?.access_token) {
                try {
                    // Fetch small page size for "Recent" list
                    const response = await listEvents(auth.user.access_token, 0); 
                    // Take first few items
                    setRecentEvents((response.content || []).slice(0, 5));
                } catch (error) {
                    console.error("Failed to fetch recent events:", error);
                } finally {
                    setIsLoading(false);
                }
            } else if (!auth.isLoading) {
                 setIsLoading(false);
            }
        };
        fetchRecentEvents();
    }, [auth.isAuthenticated, auth.user?.access_token, auth.isLoading]);

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Total Events</h3>
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-gray-800">{recentEvents.length}</span>
                        <span className="ml-2 text-sm text-green-500">Active</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Total Tickets Sold</h3>
                         <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                        </div>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-gray-800">-</span>
                        <span className="ml-2 text-sm text-gray-400">Not implemented</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                    </div>
                     <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-gray-800">-</span>
                        <span className="ml-2 text-sm text-gray-400">Not implemented</span>
                    </div>
                </div>
            </div>

            {/* Recent Events Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Recent Events</h2>
                    <Link href="/dashboard/events" className="text-blue-600 text-sm font-medium hover:text-blue-700 transition">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Event Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type Count</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                             {recentEvents.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No recent events found.
                                    </td>
                                </tr>
                             ) : (
                                recentEvents.map(event => (
                                    <tr key={event.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mr-3">
                                                    {event.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="text-sm font-medium text-gray-900">{event.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {event.start ? new Date(event.start).toLocaleDateString() : 'TBD'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                event.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {event.ticketTypes?.length || 0}
                                        </td>
                                    </tr>
                                ))
                             )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
