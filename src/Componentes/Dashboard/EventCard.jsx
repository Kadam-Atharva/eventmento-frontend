import React from "react";
import Link from "next/link";
import EventImage from "../Common/EventImage";
import { useRoles } from "@/hooks/useRoles";

export default function EventCard({ event, footer }) {
  const { isOrganizer } = useRoles();
  if (!event) return null;

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-white/60 overflow-hidden hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full group">
      <div className="h-48 bg-gray-100 relative shrink-0 overflow-hidden">
        <EventImage
          src={event.coverImage}
          alt={event.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 right-4 z-10">
          <span
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm backdrop-blur-md ${
              event.status === "PUBLISHED"
                ? "bg-green-500/90 text-white border border-green-400"
                : "bg-yellow-500/90 text-white border border-yellow-400"
            }`}
          >
            {event.status}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col grow relative">
        <div className="mb-4 grow">
          <p className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wide">
            {event.start ? new Date(event.start).toLocaleDateString() : "TBD"}
          </p>
          <h3 className="text-xl font-extrabold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">{event.name}</h3>

          <p className="text-sm text-gray-500 mb-4 line-clamp-2 font-medium">
            {event.description || "No description provided."}
          </p>

          <p className="text-sm text-gray-500 flex items-center font-medium bg-gray-50/50 p-2 rounded-lg border border-gray-100">
            <svg
              className="w-4 h-4 mr-2 shrink-0 text-gray-400"
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
            <span className="truncate">{event.venue}</span>
          </p>
        </div>
        {footer ? (
          <div className="border-t border-gray-100 pt-5 shrink-0 mt-auto">
            {footer}
          </div>
        ) : (
          <div className="border-t border-gray-100 pt-5 flex justify-between items-center text-sm shrink-0 mt-auto">
            <span className="text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
              <span className="font-bold text-gray-900">
                {event.ticketTypes?.length || 0}
              </span>{" "}
              Types
            </span>
            <Link
              href={
                isOrganizer
                  ? `/dashboard/events/${event.id}`
                  : `/events/${event.id}?source=dashboard`
              }
              className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl font-semibold shadow-sm shadow-blue-500/30 transition-colors"
            >
              {isOrganizer ? "Manage" : "Details"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
