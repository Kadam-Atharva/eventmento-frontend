export const isErrorResponse = (obj) => {
  return (
    obj &&
    typeof obj === "object" &&
    "error" in obj &&
    typeof obj.error === "string"
  );
};

export const EventStatusEnum = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
};

export const TicketStatus = {
  PURCHASED: "PURCHASED",
  CANCELLED: "CANCELLED",
};

export const TicketValidationMethod = {
  QR_SCAN: "QR_SCAN",
  MANUAL: "MANUAL",
};

export const TicketValidationStatus = {
  VALID: "VALID",
  INVALID: "INVALID",
  EXPIRED: "EXPIRED",
};

export const createEvent = async (accessToken, request) => {
  const response = await fetch("/api/v1/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    if (isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error(JSON.stringify(responseBody));
      throw new Error("An unknown error occurred");
    }
  }
};

export const updateEvent = async (accessToken, id, request) => {
  const response = await fetch(`/api/v1/events/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    if (isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error(JSON.stringify(responseBody));
      throw new Error("An unknown error occurred");
    }
  }
};

export const listEvents = async (accessToken) => {
  const response = await fetch(`/api/v1/events`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`API Error: ${response.status} ${response.statusText}`, text);
    let errorMsg = `An unknown error occurred (${response.status})`;
    try {
      const json = JSON.parse(text);
      if (isErrorResponse(json)) {
        errorMsg = json.error;
      }
    } catch (e) {
      // already logged
    }
    throw new Error(errorMsg);
  }

  const text = await response.text();
  if (!text) {
    return []; 
  }

  try {
      return JSON.parse(text);
  } catch(e) {
       console.error("Failed to parse JSON response:", text);
       throw new Error("Invalid JSON response from server");
  }
};

export const getEvent = async (accessToken, id) => {
  const response = await fetch(`/api/v1/events/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const text = await response.text();
  
  if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`, text);
      try {
          const json = JSON.parse(text);
          if (isErrorResponse(json)) {
              throw new Error(json.error);
          }
      } catch (e) {
          // If plain text or empty, fall through
      }
      throw new Error(`An unknown error occurred (${response.status})`);
  }

  try {
      return text ? JSON.parse(text) : null;
  } catch (e) {
      console.error("Failed to parse JSON response:", text);
      throw new Error("Invalid JSON response from server");
  }
};

export const deleteEvent = async (accessToken, id) => {
  const response = await fetch(`/api/v1/events/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const responseBody = await response.json();
    if (isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error(JSON.stringify(responseBody));
      throw new Error("An unknown error occurred");
    }
  }
};

export const listPublishedEvents = async () => {
  const response = await fetch(`/api/v1/published-events`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`API Error: ${response.status} ${response.statusText}`, text);
    let errorMsg = `An unknown error occurred (${response.status})`;
    try {
      const json = JSON.parse(text);
      if (isErrorResponse(json)) {
        errorMsg = json.error;
      }
    } catch (e) {
      // logged
    }
    throw new Error(errorMsg);
  }

  const text = await response.text();
  if (!text) {
    return [];
  }

  try {
      return JSON.parse(text);
  } catch(e) {
       console.error("Failed to parse JSON response:", text);
       throw new Error("Invalid JSON response from server");
  }
};

export const searchPublishedEvents = async (query) => {
  const response = await fetch(
    `/api/v1/published-events?q=${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const text = await response.text();
    console.error(`API Error: ${response.status} ${response.statusText}`, text);
    let errorMsg = `An unknown error occurred (${response.status})`;
    try {
      const json = JSON.parse(text);
      if (isErrorResponse(json)) {
        errorMsg = json.error;
      }
    } catch (e) {
       // logged
    }
    throw new Error(errorMsg);
  }

  const text = await response.text();
  if (!text) {
    return [];
  }

  try {
      return JSON.parse(text);
  } catch(e) {
       console.error("Failed to parse JSON response:", text);
       throw new Error("Invalid JSON response from server");
  }
};

export const getPublishedEvent = async (id) => {
  const response = await fetch(`/api/v1/published-events/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseBody = await response.json();

  if (!response.ok) {
    if (isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error(JSON.stringify(responseBody));
      throw new Error("An unknown error occurred");
    }
  }

  return responseBody;
};

export const purchaseTicket = async (accessToken, eventId, ticketTypeId) => {
  const response = await fetch(
    `/api/v1/events/${eventId}/ticket-types/${ticketTypeId}/tickets`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const responseBody = await response.json();
    if (isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error(JSON.stringify(responseBody));
      throw new Error("An unknown error occurred");
    }
  }
};

export const listTickets = async (accessToken) => {
  const response = await fetch(`/api/v1/tickets`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`API Error: ${response.status} ${response.statusText}`, text);
    let errorMsg = `An unknown error occurred (${response.status})`;
    try {
      const json = JSON.parse(text);
      if (isErrorResponse(json)) {
        errorMsg = json.error;
      }
    } catch (e) {
       // logged
    }
    throw new Error(errorMsg);
  }

  const text = await response.text();
  if (!text) {
    return [];
  }

  try {
      return JSON.parse(text);
  } catch(e) {
       console.error("Failed to parse JSON response:", text);
       throw new Error("Invalid JSON response from server");
  }
};

export const getTicket = async (accessToken, id) => {
  const response = await fetch(`/api/v1/tickets/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const responseBody = await response.json();

  if (!response.ok) {
    if (isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error(JSON.stringify(responseBody));
      throw new Error("An unknown error occurred");
    }
  }

  return responseBody;
};

export const getTicketQr = async (accessToken, id) => {
  const response = await fetch(`/api/v1/tickets/${id}/qr-codes`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.ok) {
    return await response.blob();
  } else {
    throw new Error("Unable to get ticket QR code");
  }
};

export const validateTicket = async (accessToken, request) => {
  const response = await fetch(`/api/v1/ticket-validations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    if (isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error(JSON.stringify(responseBody));
      throw new Error("An unknown error occurred");
    }
  }

  return responseBody;
};

export const getCurrentUser = async (accessToken) => {
  const response = await fetch(`/user/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const responseBody = await response.json();

  if (!response.ok) {
    if (isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error(JSON.stringify(responseBody));
      throw new Error("An unknown error occurred");
    }
  }

  return responseBody;
};
