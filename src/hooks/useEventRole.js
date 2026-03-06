import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { getEventRole } from "@/domain/domain";

export const useEventRole = (eventId) => {
  const { isLoading: isAuthLoading, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [eventRole, setEventRole] = useState("NONE");
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    if (!eventId) {
      setIsLoading(false);
      return;
    }

    if (isAuthLoading || !user?.access_token) {
      if (!isAuthLoading) {
        setIsLoading(false);
      }
      return;
    }

    const fetchRole = async () => {
      try {
        setIsLoading(true);
        const data = await getEventRole(user.access_token, eventId);
        if (isMounted) {
          setEventRole(data.role);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch event role", err);
          setError(err.message);
          setEventRole("NONE");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRole();

    return () => {
      isMounted = false;
    };
  }, [eventId, isAuthLoading, user?.access_token]);

  return {
    isLoading,
    eventRole,
    isOrganizer: eventRole === "ORGANIZER",
    isStaff: eventRole === "STAFF",
    isAttendee: eventRole === "ATTENDEE",
    error
  };
};
