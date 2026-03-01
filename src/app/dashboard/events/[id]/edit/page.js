"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { EventStatusEnum, getEvent, updateEvent } from "@/domain/domain";

export default function EditEventPage() {
  const auth = useAuth();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      // Format to YYYY-MM-DDTHH:mm
      return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .slice(0, 16);
  };

  useEffect(() => {
     if (auth.isAuthenticated && auth.user?.access_token && id) {
         const fetchEvent = async () => {
             try {
                 const data = await getEvent(auth.user.access_token, id);
                 setFormData({
                     name: data.name || "",
                     description: data.description || "",
                     start: formatDateForInput(data.start),
                     end: formatDateForInput(data.end),
                     venue: data.venue || "",
                     salesStart: formatDateForInput(data.salesStart),
                     salesEnd: formatDateForInput(data.salesEnd),
                     status: data.status || EventStatusEnum.DRAFT,
                     coverImage: data.coverImage || "",
                     ticketTypes: data.ticketTypes || [],
                 });
             } catch (err) {
                 console.error("Failed to load event for editing:", err);
                 setError("Failed to load event details.");
             } finally {
                 setIsLoading(false);
             }
         };
         fetchEvent();
     } else if (!auth.isLoading && !auth.isAuthenticated) {
         setIsLoading(false);
     }
  }, [auth.isAuthenticated, auth.user?.access_token, auth.isLoading, id]);

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


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.user?.access_token) {
      alert("You must be logged in to edit an event");
      return;
    }

    setIsSubmitting(true);

    try {
      let processedCoverImage = formData.coverImage;

      const requestData = {
        id, // Event Id is required by the backend
        ...formData,
        coverImage: processedCoverImage,
        start: formData.start ? new Date(formData.start) : undefined,
        end: formData.end ? new Date(formData.end) : undefined,
        salesStart: formData.salesStart
          ? new Date(formData.salesStart)
          : undefined,
        salesEnd: formData.salesEnd ? new Date(formData.salesEnd) : undefined,
      };

      console.log("SENDING UPDATED EVENT DATA TO BACKEND:", requestData);
      
      await updateEvent(auth.user.access_token, id, requestData);
      alert("Event Updated Successfully!");
      router.push(`/dashboard/events/${id}`);
    } catch (error) {
      console.error("Failed to update event:", error);
      alert(`Failed to update event: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading event data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Edit Event</h2>
        <Link
          href={`/dashboard/events/${id}`}
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

        <div className="flex justify-end gap-4">
          <Link
             href={`/dashboard/events/${id}`}
             className="px-8 py-3 rounded-full font-bold text-gray-600 hover:bg-gray-100 transition"
          >
            Discard
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition transform ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:shadow-xl hover:bg-blue-700 hover:-translate-y-0.5"}`}
          >
            {isSubmitting ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
