"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "react-oidc-context";
import { listEvents, listPublishedEvents } from "@/domain/domain";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import EventCard from "@/Componentes/Dashboard/EventCard";
import SearchEvents from "@/Componentes/Dashboard/SearchEvents";

export default function DashboardPage() {
  const auth = useAuth();
  const [recentEvents, setRecentEvents] = useState([]);
  const [globalEvents, setGlobalEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrganizer, setIsOrganizer] = useState(false);

  useEffect(() => {
    const fetchRecentEvents = async () => {
      if (auth.isAuthenticated && auth.user?.access_token) {
        try {
          const decoded = jwtDecode(auth.user.access_token);
          // To be robust against different custom backends
          const roles = decoded.roles || decoded.authorities || decoded.realm_access?.roles || [];
          const orgOrAdmin = roles.includes("ROLE_ORGANIZER") || roles.includes("organizer") || roles.includes("ROLE_ADMIN") || roles.includes("admin");
          setIsOrganizer(orgOrAdmin);

          // Fetch global events for everyone
          const globalResponse = await listPublishedEvents();
          const globalList = Array.isArray(globalResponse) ? globalResponse : globalResponse.content || [];
          setGlobalEvents(globalList.slice(0, 6));

          // Check if user is an Organizer or Admin
          if (orgOrAdmin) {
            const response = await listEvents(auth.user.access_token);
            const eventsList = Array.isArray(response) ? response : response.content || [];
            setRecentEvents(eventsList.slice(0, 6));
          } else {
            // Attendees just see global events on their dashboard overview
            setRecentEvents([]);
          }
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
      {isOrganizer && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-3xl shadow-lg shadow-blue-500/30 text-white relative overflow-hidden group transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-blue-100 text-sm font-bold uppercase tracking-wider">Total Events</h3>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 shadow-inner">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
          <div className="flex items-baseline relative z-10">
            <span className="text-4xl font-extrabold text-white tracking-tight">
              {recentEvents.length}
            </span>
            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-blue-400/30 text-xs font-bold text-blue-50 border border-blue-400/50 backdrop-blur-sm shadow-sm">Active</span>
          </div>
        </div>
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-3xl shadow-lg shadow-purple-500/30 text-white relative overflow-hidden group transform hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-24 h-24 transform rotate-12 group-hover:rotate-0 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
              </div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-purple-100 text-sm font-bold uppercase tracking-wider">
                  Tickets Sold
                </h3>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 shadow-inner">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline relative z-10">
                <span className="text-4xl font-extrabold text-white tracking-tight">-</span>
                <span className="ml-3 text-sm font-semibold text-purple-200">
                  Not implemented
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl shadow-lg shadow-emerald-500/30 text-white relative overflow-hidden group transform hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-24 h-24 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-emerald-100 text-sm font-bold uppercase tracking-wider">
                  Total Revenue
                </h3>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 shadow-inner">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline relative z-10">
                <span className="text-4xl font-extrabold text-white tracking-tight">-</span>
                <span className="ml-3 text-sm font-semibold text-emerald-200">
                  Not implemented
                </span>
              </div>
            </div>
        </div>
      )}

      {/* Organizer's Recent Events Section */}
      {isOrganizer && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">My Recent Events</h2>
            <Link
              href="/dashboard/events"
              className="text-blue-600 text-sm font-medium hover:text-blue-700 transition"
            >
              View All
            </Link>
          </div>
          {recentEvents.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <p className="text-gray-500">No recent events found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentEvents.map((event) => (
                <EventCard key={`my-${event.id}`} event={event} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Global Events Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Explore Global Events</h2>
        </div>
        {globalEvents.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">No global events available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {globalEvents.map((event) => (
              <EventCard key={`global-${event.id}`} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Search New Events Section */}
      <SearchEvents />
    </div>
  );
}
