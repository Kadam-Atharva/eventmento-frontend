import React from "react";
import Link from "next/link";
import EventImage from "../Common/EventImage";

export default function EventCard({ event, footer }) {
  if (!event) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      <div className="h-32 bg-gray-100 relative">
        <EventImage 
          src={event.coverImage} 
          alt={event.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              event.status === "PUBLISHED"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {event.status}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="mb-4">
          <p className="text-sm text-blue-600 font-medium mb-1">
            {event.start ? new Date(event.start).toLocaleDateString() : "TBD"}
          </p>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{event.name}</h3>
          
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {event.description || "No description provided."}
          </p>

          <p className="text-sm text-gray-500 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            {event.venue}
          </p>
        </div>
        {footer ? (
          <div className="border-t border-gray-100 pt-4">
            {footer}
          </div>
        ) : (
          <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-sm">
            <span className="text-gray-600">
              <span className="font-semibold text-gray-900">
                {event.ticketTypes?.length || 0}
              </span>{" "}
              Ticket Types
            </span>
            <Link
              href={`/dashboard/events/${event.id}`}
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Manage
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

