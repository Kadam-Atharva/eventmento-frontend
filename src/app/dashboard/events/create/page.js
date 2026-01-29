'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EventStatusEnum } from '@/utils/constants';

export default function CreateEventPage() {
    const [formData, setFormData] = useState({
        name: '',
        start: '',
        end: '',
        venue: '',
        salesStart: '',
        salesEnd: '',
        status: EventStatusEnum.DRAFT,
        ticketTypes: []
    });

    const addTicketType = () => {
        setFormData({
            ...formData,
            ticketTypes: [
                ...formData.ticketTypes,
                { name: '', price: 0, description: '', totalAvailable: 0 }
            ]
        });
    };

    const removeTicketType = (index) => {
        const newTicketTypes = [...formData.ticketTypes];
        newTicketTypes.splice(index, 1);
        setFormData({ ...formData, ticketTypes: newTicketTypes });
    };

    const updateTicketType = (index, field, value) => {
        const newTicketTypes = [...formData.ticketTypes];
        newTicketTypes[index][field] = value;
        setFormData({ ...formData, ticketTypes: newTicketTypes });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting Event Request:', formData);
        // TODO: Call createEvent API here
        // await createEvent(accessToken, formData);
        alert('Event Created! (Check console for data)');
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Create New Event</h2>
                <Link href="/dashboard/events" className="text-gray-500 hover:text-gray-700 font-medium">
                    Cancel
                </Link>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Event Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Event Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
                            <input 
                                type="text" 
                                name="name" 
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition" 
                                placeholder="e.g. Annual Tech Conference" 
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Venue *</label>
                            <input 
                                type="text" 
                                name="venue" 
                                required
                                value={formData.venue}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition" 
                                placeholder="e.g. Moscone Center" 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select 
                                name="status" 
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition bg-white"
                            >
                                {Object.values(EventStatusEnum).map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date & Time</label>
                            <input 
                                type="datetime-local" 
                                name="start" 
                                value={formData.start}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date & Time</label>
                            <input 
                                type="datetime-local" 
                                name="end" 
                                value={formData.end}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition" 
                            />
                        </div>
                    </div>
                </div>

                {/* Sales Setting */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Sales Period
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sales Start</label>
                            <input 
                                type="datetime-local" 
                                name="salesStart" 
                                value={formData.salesStart}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sales End</label>
                            <input 
                                type="datetime-local" 
                                name="salesEnd" 
                                value={formData.salesEnd}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition" 
                            />
                        </div>
                    </div>
                </div>

                {/* Ticket Types */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                            Ticket Types
                        </h3>
                        <button 
                            type="button" 
                            onClick={addTicketType}
                            className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition font-medium flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Add Ticket
                        </button>
                    </div>

                    {formData.ticketTypes.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                            No ticket types added yet. Click "Add Ticket" to start selling.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {formData.ticketTypes.map((ticket, index) => (
                                <div key={index} className="bg-gray-50 rounded-xl p-6 relative border border-gray-200">
                                    <button 
                                        type="button"
                                        onClick={() => removeTicketType(index)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Ticket Name</label>
                                            <input 
                                                type="text" 
                                                value={ticket.name}
                                                onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-400 bg-white" 
                                                placeholder="e.g. VIP Admission"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Price ($)</label>
                                            <input 
                                                type="number" 
                                                value={ticket.price}
                                                onChange={(e) => updateTicketType(index, 'price', parseFloat(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-400 bg-white" 
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Quantity Available</label>
                                            <input 
                                                type="number" 
                                                value={ticket.totalAvailable}
                                                onChange={(e) => updateTicketType(index, 'totalAvailable', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-400 bg-white" 
                                                min="0"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                                            <textarea 
                                                value={ticket.description}
                                                onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-400 bg-white" 
                                                rows="2"
                                                placeholder="What's included in this ticket..."
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" className="px-8 py-3 rounded-full font-bold text-gray-600 hover:bg-gray-100 transition">Discard</button>
                    <button type="submit" className="px-8 py-3 rounded-full font-bold bg-blue-600 text-white shadow-lg hover:shadow-xl hover:bg-blue-700 transition transform hover:-translate-y-0.5">
                        Create Event
                    </button>
                </div>
            </form>
        </div>
    );
}
