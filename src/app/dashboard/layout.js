"use client";
import React from 'react';
import Sidebar from '@/Componentes/Dashboard/Sidebar';
import { useAuth } from "react-oidc-context";
import { useRoles } from '@/hooks/useRoles';

export default function DashboardLayout({ children }) {
  const auth = useAuth();
  const user = auth.user?.profile;
  const { isOrganizer, isAttendee, isStaff } = useRoles();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500">Welcome back, {user?.name || user?.preferred_username || "User"}</p>
            </div>
            <div className="flex items-center space-x-4">
                <div className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm ${
                    isOrganizer ? "bg-purple-600 text-white" :
                    isStaff ? "bg-orange-500 text-white" :
                    isAttendee ? "bg-blue-600 text-white" :
                    "bg-gray-200 text-gray-700"
                }`}>
                    {isOrganizer ? "Organizer" : isStaff ? "Staff" : isAttendee ? "Attendee" : "Guest"}
                </div>

                 <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors relative">
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                 </button>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                    {(user?.name?.[0] || user?.preferred_username?.[0] || "U").toUpperCase()}
                </div>
            </div>
        </header>
        {children}
      </main>
    </div>
  );
}
