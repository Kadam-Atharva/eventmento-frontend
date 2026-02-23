"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { getPublishedEvent, purchaseTicket } from "@/domain/domain";
import EventImage from "@/Componentes/Common/EventImage";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const auth = useAuth();
  const { id } = params;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          const data = await getPublishedEvent(id);
          console.log("Event Data:", data);
          if (data?.coverImage) {
            console.log("Cover Image Found:", {
              length: data.coverImage.length,
              startsWithData: data.coverImage.startsWith("data:image"),
              preview: data.coverImage.substring(0, 50) + "...",
            });
          } else {
            console.warn("Event Data missing coverImage");
          }
          setEvent(data);
        } catch (err) {
          console.error("Failed to load event", err);
          setError("Failed to load event details.");
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [id]);

  const handleTicketSelect = (ticket) => {
    if (selectedTicket?.id === ticket.id) {
      setSelectedTicket(null); // Deselect
    } else {
      setSelectedTicket(ticket);
      setQuantity(1);
    }
  };

  const handleBooking = async () => {
    if (!auth.isAuthenticated) {
      // Redirect to login or show message
      auth.signinRedirect();
      return;
    }

    if (!selectedTicket) return;

    setBookingLoading(true);
    try {
      // The API purchaseTicket(accessToken, eventId, ticketTypeId) only buys 1 ticket?
      // The method signature in domain.js is purchaseTicket(accessToken, eventId, ticketTypeId)
      // It doesn't seem to take quantity. It creates ONE ticket.
      // If the user wants multiple, we might need a loop or update the backend/API.
      // For now, I'll assume one ticket per request or loop if quantity > 1 used (but UI implies single selection flow usually or quantity).
      // Checking domain.js again:
      // export const purchaseTicket = async (accessToken, eventId, ticketTypeId) => { ... POST ... }
      // It doesn't take a body with quantity. It just posts to .../tickets.
      // So likely it buys ONE ticket. I will implement a loop if quantity > 1 or restrict to 1 for now.
      // Let's loop for now to be safe if they want multiple, or just restrict to 1 in UI if it's safer.
      // Given "how the attendee can book a ticket" (singular), I will default to loop if they pick > 1.

      for (let i = 0; i < quantity; i++) {
        await purchaseTicket(auth.user.access_token, id, selectedTicket.id);
      }

      alert(`Successfully booked ${quantity} ticket(s)!`);
      router.push("/dashboard/tickets");
    } catch (err) {
      console.error("Booking failed", err);
      alert("Booking failed: " + err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600">
            {error || "The event you are looking for does not exist."}
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section with Cover Image */}
      <div className="relative h-96 w-full bg-gray-900">
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center text-white/80 hover:text-white bg-black/30 hover:bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm transition-all"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back to Dashboard
          </button>
        </div>
        <EventImage
          src={event.coverImage}
          alt={event.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 bg-gradient-to-t from-gray-900 via-transparent to-transparent">
          <div className="max-w-7xl mx-auto w-full">
            <span
              className={`inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider uppercase rounded-full ${
                event.status === "PUBLISHED"
                  ? "bg-green-500 text-white"
                  : "bg-yellow-500 text-white"
              }`}
            >
              {event.status}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 shadow-sm">
              {event.name}
            </h1>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-gray-200">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <span className="text-lg font-medium">
                  {event.start
                    ? new Date(event.start).toLocaleString()
                    : "Date TBD"}
                </span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
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
                <span className="text-lg font-medium">{event.venue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              About This Event
            </h3>
            <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
              {event.description || "No description provided."}
            </div>
          </div>

          {/* Additional Info Cards could go here */}
        </div>

        {/* Sidebar / Booking Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Select Tickets
            </h3>

            {!event.ticketTypes || event.ticketTypes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No tickets available for this event.
              </div>
            ) : (
              <div className="space-y-4">
                {event.ticketTypes.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => handleTicketSelect(ticket)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedTicket?.id === ticket.id
                        ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                        : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900">{ticket.name}</h4>
                      <span className="font-bold text-lg text-blue-600">
                        ${ticket.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      {ticket.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{ticket.totalAvailable} available</span>
                    </div>
                  </div>
                ))}

                {selectedTicket && (
                  <div className="mt-6 pt-6 border-t border-gray-100 animate-fadeIn">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium text-gray-700">
                        Quantity
                      </span>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold transition"
                        >
                          -
                        </button>
                        <span className="font-bold text-gray-900 w-4 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() =>
                            setQuantity(Math.min(10, quantity + 1))
                          } // Cap at 10 for safety
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-100">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ${(selectedTicket.price * quantity).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={handleBooking}
                      disabled={bookingLoading}
                      className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition transform hover:-translate-y-1 ${
                        bookingLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl"
                      }`}
                    >
                      {bookingLoading
                        ? "Processing..."
                        : auth.isAuthenticated
                          ? "Book Tickets"
                          : "Login to Book"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
