
// Helper function to check for error response
const isErrorResponse = (response) => {
    return response && response.error;
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

export const listEvents = async (accessToken, page) => {
    const response = await fetch(`/api/v1/events?page=${page}&size=6`, {
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

export const getEvent = async (accessToken, id) => {
    const response = await fetch(`/api/v1/events/${id}`, {
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

export const listPublishedEvents = async (page) => {
    const response = await fetch(`/api/v1/published-events?page=${page}&size=6`, {
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
