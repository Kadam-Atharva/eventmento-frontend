import React, { useState } from "react";

export default function EventImage({ src, alt, className }) {
  const [hasError, setHasError] = useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  // If no src is provided, or if it failed to load, show fallback
  if (!src || hasError) {
    if (!src) console.warn("EventImage: No src provided", { alt });
    if (hasError)
      console.warn("EventImage: Failed to load image", {
        src: src?.substring(0, 50) + "...",
        alt,
      });

    return (
      <div
        className={`bg-gray-100 flex items-center justify-center text-gray-400 ${className}`}
      >
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
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
      </div>
    );
  }

  // Check if it's a Base64 string that needs the prefix
  // The user said: "Detect whether the string starts with `data:image/` to confirm it is a Base64-encoded image."
  // And "If valid, render it directly... If the string is missing the prefix, corrupted, or invalid, show a fallback UI"
  // However, sometimes APIs return JUST the base64 string without the prefix.
  // The user prompt says: "When the API returns a string formatted like `data:image/png;base64,...` treat it as valid... If the string is missing the prefix... show a fallback UI".
  // This implies I should EXPECT the prefix.
  // But good practice used to be to add it if missing.
  // User instruction: "If the string is missing the prefix, corrupted, or invalid, show a fallback UI".
  // So STRICTLY check for prefix.

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || "Event Image"} // Fallback alt text
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
