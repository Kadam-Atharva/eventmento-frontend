"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from "react-oidc-context";
import { useCurrentUser } from '@/hooks/useUser';
import { useRoles } from '@/hooks/useRoles';
import EventImage from '../Common/EventImage';

const Sidebar = () => {
    const auth = useAuth();
    const { isOrganizer, isStaff, isAttendee } = useRoles();
    const { user } = useCurrentUser();
    const pathname = usePathname();

    const getLinkClass = (href, exact = false) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return `flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${
            isActive
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transform scale-[1.02]'
                : 'text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-md hover:shadow-gray-200/50 hover:-translate-y-0.5'
        }`;
    };

    const getIconClass = (href, exact = false) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return `w-5 h-5 mr-3 transition-colors ${
            isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'
        }`;
    };

    return (
        <aside className="w-64 bg-white/70 backdrop-blur-2xl border-r border-white/50 min-h-screen fixed left-0 top-0 flex flex-col z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            <div className="p-6 pb-2 pt-8 flex items-center justify-center">
                 <div className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 relative group cursor-pointer drop-shadow-sm">
                    EventMento
                    <span className="absolute -bottom-2 left-1/4 w-1/2 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-50 blur-[2px]"></span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                </div>
            </div>
            
            <nav className="flex-1 p-4 mt-4 space-y-2 overflow-y-auto custom-scrollbar">
                <Link href="/dashboard" className={getLinkClass("/dashboard", true)}>
                    <svg className={getIconClass("/dashboard", true)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                    <span className="font-semibold">Overview</span>
                </Link>
                
                <Link href="/dashboard/events" className={getLinkClass("/dashboard/events")}>
                    <svg className={getIconClass("/dashboard/events")} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span className="font-semibold">Events</span>
                </Link>

                <Link href="/dashboard/tickets" className={getLinkClass("/dashboard/tickets")}>
                     <svg className={getIconClass("/dashboard/tickets")} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                    <span className="font-semibold">Tickets</span>
                </Link>

                {(isOrganizer || isStaff) && (
                    <Link href="/dashboard/validate-qr" className={getLinkClass("/dashboard/validate-qr")}>
                        <svg className={getIconClass("/dashboard/validate-qr")} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 17h.01M16 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span className="font-semibold">Validate QR</span>
                    </Link>
                )}

                 <div className="pt-6 mt-4">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Settings</p>
                    <Link href="/dashboard/settings" className={getLinkClass("/dashboard/settings")}>
                        <svg className={getIconClass("/dashboard/settings")} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span className="font-semibold">Settings</span>
                    </Link>
                </div>
            </nav>

            <div className="p-5 border-t border-gray-100 bg-white/50 backdrop-blur-md">
                {user && (
                    <div className="flex items-center mb-5 px-1">
                        <div className="w-11 h-11 rounded-full overflow-hidden mr-3 border-2 border-white shadow-md bg-gradient-to-tr from-blue-100 to-indigo-50">
                            <EventImage 
                                src={user.profileImage} 
                                alt={user.name} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate tracking-tight">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-500 font-medium truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>
                )}
                <button 
                    onClick={() => auth.signoutRedirect()}
                    className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50/50 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 group shadow-sm"
                >
                    <svg className="w-4 h-4 mr-2 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
