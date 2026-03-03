'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRoles } from '@/hooks/useRoles';
import { useAuth } from "react-oidc-context";
import { listEvents, listPublishedEvents } from '@/domain/domain';
import { jwtDecode } from "jwt-decode";
import EventImage from "@/Componentes/Common/EventImage";


export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isOrganizer } = useRoles();
    const auth = useAuth();

    useEffect(() => {
        const fetchEvents = async () => {
            if (auth.isAuthenticated && auth.user?.access_token) {
                try {
                    const decoded = jwtDecode(auth.user.access_token);
                    const roles = decoded.realm_access?.roles || [];
                    
                    let response;
                    if (roles.includes('ROLE_ORGANIZER') || roles.includes('ROLE_ADMIN')) {
                        console.log("Fetching events for ORGANIZER/ADMIN");
                        response = await listEvents(auth.user.access_token);
                    } else {
                        console.log("Fetching published events for ATTENDEE");
                        response = await listPublishedEvents();
                    }

                    console.log("Raw Events Response:", response);
                    const eventsList = Array.isArray(response) ? response : (response.content || []);
                    console.log("Processed Events List:", eventsList);
                    setEvents(eventsList);
                } catch (error) {
                    console.error("Failed to fetch events:", error);
                } finally {
                    setIsLoading(false);
                }
            } else if (!auth.isLoading) {
                 setIsLoading(false);
            }
        };

        fetchEvents();
    }, [auth.isAuthenticated, auth.user?.access_token, auth.isLoading]);

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
            ) : events.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100 dark:border-gray-800">
                    <p className="text-gray-500">No events found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                            <div className="h-32 bg-gray-100 relative">
                                <EventImage 
                                    src={event.coverImage} 
                                    alt={event.name} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        event.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="mb-4">
                                    <p className="text-sm text-blue-600 font-medium mb-1">
                                        {event.start ? new Date(event.start).toLocaleDateString() : 'TBD'}
                                    </p>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{event.name}</h3>
                                    
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                        {event.description || "No description provided."}
                                    </p>

                                    <p className="text-sm text-gray-500 flex items-center">
                                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        {event.venue}
                                    </p>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-sm">
                                    <span className="text-gray-600">
                                        <span className="font-semibold text-gray-900">{event.ticketTypes?.length || 0}</span> Ticket Types
                                    </span>
                                    {isOrganizer ? (
                                        <Link href={`/dashboard/events/${event.id}`} className="text-blue-600 font-medium hover:text-blue-700">Manage</Link>
                                    ) : (
                                        <Link href={`/events/${event.id}?source=dashboard`} className="text-blue-600 font-medium hover:text-blue-700">View Details</Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
