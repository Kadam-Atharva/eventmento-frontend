import React, { useState } from 'react';
import { searchPublishedEvents } from '@/domain/domain';
import EventCard from './EventCard';

export default function SearchEvents() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            const response = await searchPublishedEvents(query); 
            // Handle both paginated and non-paginated responses
            setResults(Array.isArray(response) ? response : (response.content || []));
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsLoading(false);
            setHasSearched(true);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Find New Events</h3>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search events by name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </form>
            </div>

            {hasSearched && (
                <div className="space-y-4">
                    <h4 className="text-gray-600 font-medium">
                        Search Results ({results.length})
                    </h4>
                    {results.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                             <p className="text-gray-500">No events found matching "{query}"</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map(event => (
                                <EventCard 
                                    key={event.id} 
                                    event={event} 
                                    footer={
                                        <div className="flex justify-between items-center w-full">
                                            <span className="text-sm text-gray-500">
                                                 {event.ticketTypes?.length > 0 ? 'Tickets Available' : 'No Tickets'}
                                            </span>
                                        </div>
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
