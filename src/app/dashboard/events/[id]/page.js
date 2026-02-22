'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from "react-oidc-context";
import { getEvent } from '@/domain/domain';
import EventImage from "@/Componentes/Common/EventImage";
import Link from 'next/link';

export default function EventDashboardDetails() {
    const params = useParams();
    const router = useRouter();
    const auth = useAuth();
    const { id } = params;

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (auth.isAuthenticated && auth.user?.access_token && id) {
            const fetchEvent = async () => {
                try {
                    const data = await getEvent(auth.user.access_token, id);
                    if (data?.coverImage) {
                         console.log("Dashboard Event Data - Cover Image Found:", {
                             length: data.coverImage.length,
                             startsWithData: data.coverImage.startsWith("data:image"),
                             preview: data.coverImage.substring(0, 50) + "..."
                         });
                    } else {
                        console.warn("Dashboard Event Data missing coverImage");
                    }
                    setEvent(data);
                } catch (err) {
                    console.error("Failed to load event", err);
                    // Fallback: If user is not the organizer (404/403), redirect them to the public attendee view
                    if (err.message?.includes('404') || err.message?.includes('403') || err.message?.includes('Not Found') || err.message?.includes('Forbidden')) {
                        console.log("Redirecting to public attendee view...");
                        router.push(`/events/${id}`);
                        return;
                    }
                    setError("Failed to load event details.");
                } finally {
                    setLoading(false);
                }
            };
            fetchEvent();
        } else if (!auth.isLoading && !auth.isAuthenticated) {
             // Optional: redirect to login if strictly protected, usually handled by wrapper or layout
        }
    }, [auth.isAuthenticated, auth.user?.access_token, auth.isLoading, id]);

    if (loading) return <div className="p-8 text-center">Loading event details...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!event) return <div className="p-8 text-center">Event not found</div>;

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <Link href="/dashboard/events" className="mr-4 text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-800">Manage Event</h2>
                </div>
                <div className="space-x-4">
                     {/* Placeholder for Edit button */}
                     <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Edit Event
                     </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="h-64 md:h-80 w-full relative bg-gray-100">
                    <EventImage 
                        src={event.coverImage} 
                        alt={event.name} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                            event.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                            {event.status}
                        </span>
                    </div>
                </div>
                
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.name}</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 mr-3 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Start Date</p>
                                    <p className="text-gray-900 font-medium">{event.start ? new Date(event.start).toLocaleString() : 'TBD'}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <svg className="w-5 h-5 mr-3 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">End Date</p>
                                    <p className="text-gray-900 font-medium">{event.end ? new Date(event.end).toLocaleString() : 'TBD'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 mr-3 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Venue</p>
                                    <p className="text-gray-900 font-medium">{event.venue}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {event.description && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                            <div className="prose text-gray-600">
                                {event.description}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
             <div className="text-center">
                 <p className="text-gray-500 text-sm">Preview Public Page check: <Link href={`/events/${event.id}`} target="_blank" className="text-blue-600 hover:underline">/events/{event.id}</Link></p>
             </div>
        </div>
    );
}
