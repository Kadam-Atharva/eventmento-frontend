"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { EventStatusEnum, createEvent } from "@/domain/domain";

export default function CreateEventPage() {
  const auth = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start: "",
    end: "",
    venue: "",
    salesStart: "",
    salesEnd: "",
    status: EventStatusEnum.DRAFT,
    coverImage: "",
    ticketTypes: [],
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, coverImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addTicketType = () => {
    setFormData({
      ...formData,
      ticketTypes: [
        ...formData.ticketTypes,
        { name: "", price: 0, description: "", totalAvailable: 0 },
      ],
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

    if (!auth.user?.access_token) {
      alert("You must be logged in to create an event");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send the full base64 string (including data:image/...;base64,)
      let processedCoverImage = formData.coverImage;

      // Convert string dates to Date objects/ISO strings if needed by backend,
      // or just send as-is if backend accepts it.
      // The interface said Date, so wrapping in new Date() is safer for generic backend.
      const requestData = {
        ...formData,
        coverImage: processedCoverImage,
        start: formData.start ? new Date(formData.start) : undefined,
        end: formData.end ? new Date(formData.end) : undefined,
        salesStart: formData.salesStart
          ? new Date(formData.salesStart)
          : undefined,
        salesEnd: formData.salesEnd ? new Date(formData.salesEnd) : undefined,
      };

      console.log("SENDING EVENT DATA TO BACKEND:", requestData);
      if (requestData.coverImage) {
        console.log("Cover Image Length:", requestData.coverImage.length);
      } else {
        console.warn("No cover image in payload!");
      }

      await createEvent(auth.user.access_token, requestData);
      alert("Event Created Successfully!");
      router.push("/dashboard/events");
    } catch (error) {
      console.error("Failed to create event:", error);
      alert(`Failed to create event: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Create New Event</h2>
        <Link
          href="/dashboard/events"
          className="text-gray-500 hover:text-gray-700 font-medium"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Event Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Event Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Name *
              </label>
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                placeholder="Describe your event..."
                rows="4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue *
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition bg-white"
              >
                {Object.values(EventStatusEnum).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                name="start"
                value={formData.start}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date & Time
              </label>
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
            <svg
              className="w-5 h-5 mr-2 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Sales Period
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sales Start
              </label>
              <input
                type="datetime-local"
                name="salesStart"
                value={formData.salesStart}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sales End
              </label>
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

        {/* Cover Image Upload */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            Cover Image
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                {formData.coverImage ? (
                  <div className="relative w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                      <p className="text-white font-medium">Click to Change</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                )}
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Ticket Types */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                ></path>
              </svg>
              Ticket Types
            </h3>
            <button
              type="button"
              onClick={addTicketType}
              className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition font-medium flex items-center"
            >
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
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
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
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 relative border border-gray-200"
                >
                  <button
                    type="button"
                    onClick={() => removeTicketType(index)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Ticket Name
                      </label>
                      <input
                        type="text"
                        value={ticket.name}
                        onChange={(e) =>
                          updateTicketType(index, "name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-400 bg-white"
                        placeholder="e.g. VIP Admission"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        value={ticket.price}
                        onChange={(e) =>
                          updateTicketType(
                            index,
                            "price",
                            parseFloat(e.target.value),
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-400 bg-white"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Quantity Available
                      </label>
                      <input
                        type="number"
                        value={ticket.totalAvailable}
                        onChange={(e) =>
                          updateTicketType(
                            index,
                            "totalAvailable",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-400 bg-white"
                        min="0"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Description
                      </label>
                      <textarea
                        value={ticket.description}
                        onChange={(e) =>
                          updateTicketType(index, "description", e.target.value)
                        }
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
          <button
            type="button"
            className="px-8 py-3 rounded-full font-bold text-gray-600 hover:bg-gray-100 transition"
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition transform ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:shadow-xl hover:bg-blue-700 hover:-translate-y-0.5"}`}
          >
            {isSubmitting ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
