'use client';

import React, { useState, useEffect } from 'react';
import { TicketValidationMethod } from '@/utils/constants';
import { useRoles } from '@/hooks/useRoles';
import { useAuth } from "react-oidc-context";
import { listTickets, validateTicket } from '@/domain/domain';

export default function TicketsPage() {
    const auth = useAuth();
    const [ticketId, setTicketId] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isOrganizer, isStaff } = useRoles();

    useEffect(() => {
        const fetchTickets = async () => {
            if (auth.isAuthenticated && auth.user?.access_token) {
                try {
                    const response = await listTickets(auth.user.access_token, 0);
                    setTickets(response.content || []);
                } catch (error) {
                    console.error("Failed to fetch tickets:", error);
                } finally {
                    setIsLoading(false);
                }
            } else if (!auth.isLoading) {
                 setIsLoading(false);
            }
        };

        fetchTickets();
    }, [auth.isAuthenticated, auth.user?.access_token, auth.isLoading]);

    const handleValidate = async (e) => {
        e.preventDefault();
        
        if (!ticketId) return;

        try {
             // Construct request object matching TicketValidationRequest interface
            const request = {
                id: ticketId,
                method: TicketValidationMethod.MANUAL
            };
            console.log("Validating Ticket:", request);
            
            // Call real validation API if token exists
             if (auth.user?.access_token) {
                const response = await validateTicket(auth.user.access_token, request);
                setValidationResult(response);
             } else {
                 setValidationResult({ ticketId: ticketId, status: 'INVALID', error: "Not authenticated" });
             }

        } catch (error) {
             console.error("Validation failed:", error);
             setValidationResult({ ticketId: ticketId, status: 'INVALID' });
        }
    };

    return (
        <div className="space-y-6">
             <h2 className="text-2xl font-bold text-gray-800">Ticket Management</h2>
 
             {/* Ticket Validation Section */}
             {(isOrganizer || isStaff) && (
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Check-in / Validate Ticket
                </h3>
                <form onSubmit={handleValidate} className="flex gap-4">
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 17h4.01M16 3h2.172a2 2 0 011.414.586l3.828 3.828A2 2 0 0124 8.828V20a2 2 0 01-2 2H2a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3z"></path></svg>
                        </span>
                        <input 
                            type="text" 
                            value={ticketId}
                            onChange={(e) => setTicketId(e.target.value)}
                            placeholder="Enter Ticket ID or Scan QR" 
                            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                        />
                    </div>
                    <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-md">
                        Validate
                    </button>
                </form>
                
                {validationResult && (
                    <div className={`mt-6 p-4 rounded-xl flex items-center border ${
                        validationResult.status === 'VALID' 
                            ? 'bg-green-50 border-green-100 text-green-700' 
                            : 'bg-red-50 border-red-100 text-red-700'
                    }`}>
                        <div className={`p-2 rounded-full mr-4 ${
                             validationResult.status === 'VALID' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                             {validationResult.status === 'VALID' ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-lg">{validationResult.status}</p>
                            <p className="text-sm opacity-80">Ticket ID: {validationResult.ticketId}</p>
                        </div>
                    </div>
                )}
             </div>
             )}

             {/* Recent Tickets List */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                             {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    </td>
                                </tr>
                             ) : tickets.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No tickets found.
                                    </td>
                                </tr>
                             ) : (
                                tickets.map(ticket => (
                                <tr key={ticket.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-medium text-gray-800">{ticket.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{ticket.ticketType?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${ticket.ticketType?.price || 0}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            ticket.status === 'PURCHASED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {ticket.status}
                                        </span>
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
