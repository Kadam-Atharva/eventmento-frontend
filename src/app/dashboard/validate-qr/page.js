"use client";

import React, { useState } from "react";
import { useRoles } from "@/hooks/useRoles";
import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";
import { Scanner } from "@yudiel/react-qr-scanner";
import { validateTicket } from "@/domain/domain";
import { TicketValidationMethod } from "@/utils/constants";

export default function ValidateQrPage() {
  const { isOrganizer, isStaff, isLoading, roles } = useRoles();
  const router = useRouter();
  const auth = useAuth();

  const [isScanning, setIsScanning] = useState(false);
  const [manualTicketId, setManualTicketId] = useState("");
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  React.useEffect(() => {
    if (!isLoading && !isOrganizer && !isStaff) {
      // Redirect or just show access denied
      // router.push('/dashboard');
    }
  }, [isLoading, isOrganizer, isStaff, router]);

  const handleValidation = async (ticketId, method) => {
    if (!ticketId || isValidating) return;

    // Pause scanning immediately so we don't spam API
    setIsValidating(true);

    try {
      const request = {
        id: ticketId,
        method: method,
      };

      if (auth.user?.access_token) {
        const response = await validateTicket(auth.user?.access_token, request);
        setValidationResult(response);
      } else {
        setValidationResult({
          ticketId: ticketId,
          status: "INVALID",
          error: "Not authenticated",
        });
      }
    } catch (error) {
      console.error("Validation failed:", error);
      setValidationResult({ ticketId: ticketId, status: "INVALID" });
    } finally {
      setIsValidating(false);

      // Auto close scanner if successful scan or validation was done
      if (isScanning && method === TicketValidationMethod.QR_SCAN) {
        setIsScanning(false);
      }

      // Note: Don't auto clear, let user press "Scan Next Ticket"
    }
  };

  const handleScan = (detectedCodes) => {
    if (!detectedCodes || detectedCodes.length === 0) return;

    const qrValue = detectedCodes[0].rawValue;
    if (qrValue && !isValidating) {
      handleValidation(qrValue, TicketValidationMethod.QR_SCAN);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualTicketId) {
      handleValidation(manualTicketId, TicketValidationMethod.MANUAL);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isOrganizer && !isStaff) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            ></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-500 max-w-md">
          You do not have permission to validate tickets. This area is
          restricted to Organizers and Staff.
        </p>
        <div className="mt-4 text-xs text-gray-400">
          Current Roles: {roles.join(", ") || "None"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Validate Tickets</h1>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 17h.01M16 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Scan QR Code</h3>
          <p className="text-gray-500">
            Point your camera at the attendee's ticket QR code.
          </p>
        </div>

        {validationResult ? (
          <div
            className={`mb-8 p-6 mx-auto max-w-md rounded-2xl flex flex-col items-center border ${
              validationResult.status === "VALID"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div
              className={`p-4 rounded-full mb-4 ${
                validationResult.status === "VALID"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {validationResult.status === "VALID" ? (
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              )}
            </div>
            <h3 className="text-2xl font-black mb-1">
              {validationResult.status}
            </h3>
            <p className="text-sm font-medium opacity-80 mb-4 font-mono">
              {validationResult.ticketId}
            </p>

            <button
              onClick={() => {
                setValidationResult(null);
                setManualTicketId("");
                setIsScanning(true);
              }}
              className={`px-6 py-2 rounded-full font-bold transition ${
                validationResult.status === "VALID"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              Scan Next Ticket
            </button>
          </div>
        ) : (
          <div className="mb-6 mx-auto max-w-md overflow-hidden rounded-2xl bg-gray-50 border-2 border-dashed border-gray-300 relative">
            {isScanning ? (
              <div className="relative">
                <Scanner
                  onScan={handleScan}
                  onError={(error) => console.log(error?.message)}
                  components={{
                    audio: false,
                    finder: false,
                  }}
                />
                {isValidating && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <p className="text-gray-500 mb-4">Camera is inactive</p>
                <button
                  onClick={() => setIsScanning(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition box-border"
                >
                  Start Scanning
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center mt-6">
          <form
            onSubmit={handleManualSubmit}
            className="relative w-full max-w-md"
          >
            <input
              type="text"
              value={manualTicketId}
              onChange={(e) => setManualTicketId(e.target.value)}
              placeholder="Or enter manual code"
              className="w-full px-5 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none pr-14 shadow-sm"
              disabled={isValidating || validationResult !== null}
            />
            <button
              type="submit"
              disabled={
                isValidating || !manualTicketId || validationResult !== null
              }
              className="absolute right-1 top-1 bottom-1 px-4 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-full text-gray-500 transition disabled:opacity-50"
            >
              <svg
                className="w-5 h-5 inline-block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
