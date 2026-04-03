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
    <div className="min-h-screen bg-slate-50 flex relative overflow-hidden font-sans text-gray-800">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-400/10 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-purple-400/10 blur-[120px]"></div>
      </div>
      
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 z-10 relative">
        <header className="flex justify-between items-center mb-10 bg-white/60 backdrop-blur-xl border border-white/80 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
                <p className="text-gray-500 font-medium mt-1">Welcome back, {user?.name || user?.preferred_username || "User"} 👋</p>
            </div>
            <div className="flex items-center space-x-5">
                <div className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm backdrop-blur-md border border-white/50 ${
                    isOrganizer ? "bg-purple-100 text-purple-700" :
                    isStaff ? "bg-orange-100 text-orange-700" :
                    isAttendee ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                }`}>
                    {isOrganizer ? "Organizer" : isStaff ? "Staff" : isAttendee ? "Attendee" : "Guest"}
                </div>

                 <button className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-full transition-all duration-300 relative group shadow-sm bg-white/50 border border-transparent hover:border-blue-100">
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white group-hover:animate-ping opacity-75"></span>
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    <svg className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                 </button>
                 
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30 border-2 border-white transform transition-transform duration-300 hover:scale-110 cursor-pointer">
                    {(user?.name?.[0] || user?.preferred_username?.[0] || "U").toUpperCase()}
                </div>
            </div>
        </header>
        
        <div className="relative">
            {children}
        </div>
      </main>
    </div>
  );
}
