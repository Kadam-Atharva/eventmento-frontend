'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRoles } from '@/hooks/useRoles';
import { useAuth } from "react-oidc-context";
import { listEvents, listPublishedEvents } from '@/domain/domain';
import { jwtDecode } from "jwt-decode";
import EventImage from "@/Componentes/Common/EventImage";
import EventCard from './EventCard';

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isOrganizer } = useRoles(); // Keep this for showing the "Create Event" button globally
    const auth = useAuth();

    useEffect(() => {
        const fetchEvents = async () => {
            if (auth.isAuthenticated && auth.user?.access_token) {
                try {
                    const decoded = jwtDecode(auth.user.access_token);
                    const roles = decoded.roles || decoded.authorities || decoded.realm_access?.roles || [];
                    
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
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
}
