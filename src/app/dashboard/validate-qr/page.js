'use client';

import React from 'react';
import { useRoles } from '@/hooks/useRoles';
import { useRouter } from 'next/navigation';

export default function ValidateQrPage() {
    const { isOrganizer, isStaff, isLoading, roles } = useRoles();
    const router = useRouter();

    React.useEffect(() => {
        if (!isLoading && !isOrganizer && !isStaff) {
            // Redirect or just show access denied
            // router.push('/dashboard'); 
        }
    }, [isLoading, isOrganizer, isStaff, router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isOrganizer && !isStaff) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                <p className="text-gray-500 max-w-md">You do not have permission to validate tickets. This area is restricted to Organizers and Staff.</p>
                <div className="mt-4 text-xs text-gray-400">Current Roles: {roles.join(', ') || 'None'}</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Validate Tickets</h1>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="mb-8">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 17h.01M16 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Scan QR Code</h3>
                    <p className="text-gray-500">Point your camera at the attendee's ticket QR code.</p>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex items-center justify-center bg-gray-50 mb-6">
                    <p className="text-gray-400">Camera View Placeholder</p>
                </div>

                <div className="flex justify-center gap-4">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition">
                        Start Scanning
                    </button>
                    <div className="relative">
                        <input type="text" placeholder="Or enter manual code" className="px-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-100 outline-none pl-4 pr-12" />
                        <button className="absolute right-1 top-1 p-1 bg-gray-100 rounded-full text-gray-500 hover:text-blue-600">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
