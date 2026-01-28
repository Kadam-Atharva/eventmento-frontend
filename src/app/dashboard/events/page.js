'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRoles } from '@/hooks/useRoles';

// Mock data (replace with API call later)
const MOCK_EVENTS = [
    { id: '1', name: 'Tech Summit 2025', date: '2025-03-15', status: 'Published', ticketsSold: 450, capacity: 500, location: 'San Francisco, CA' },
    { id: '2', name: 'Design Masterclass', date: '2025-04-02', status: 'Draft', ticketsSold: 0, capacity: 50, location: 'New York, NY' },
    { id: '3', name: 'Startup Mixer', date: '2025-04-20', status: 'Published', ticketsSold: 120, capacity: 200, location: 'Austin, TX' },
];

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isOrganizer } = useRoles();

    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            setEvents(MOCK_EVENTS);
            setIsLoading(false);
        }, 500);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">My Events</h2>
                {isOrganizer && (
                    <Link href="/dashboard/events/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Create Event
                    </Link>
                )}
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                            <div className="h-32 bg-gray-100 relative">
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <div className="absolute top-4 right-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        event.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="mb-4">
                                    <p className="text-sm text-blue-600 font-medium mb-1">{event.date}</p>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{event.name}</h3>
                                    <p className="text-sm text-gray-500 flex items-center">
                                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        {event.location}
                                    </p>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-sm">
                                    <span className="text-gray-600">
                                        <span className="font-semibold text-gray-900">{event.ticketsSold}</span> / {event.capacity} sold
                                    </span>
                                    <button className="text-blue-600 font-medium hover:text-blue-700">Manage</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
