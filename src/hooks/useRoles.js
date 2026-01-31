import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { jwtDecode } from "jwt-decode";

export const useRoles = () => {
  const { isLoading: isAuthLoading, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isAttendee, setIsAttendee] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    if (isAuthLoading || !user?.access_token) {
      setRoles([]);
      setIsOrganizer(false);
      setIsAttendee(false);
      setIsStaff(false);
      setIsLoading(isAuthLoading);
      return;
    }

    try {
      const payload = jwtDecode(user?.access_token);
      const allRoles = payload.realm_access?.roles || [];
      // Filter for specific app roles if needed, or just use all
      const filteredRoles = allRoles; 
      // The user snippet checked for "starts with ROLE_", but Keycloak usually returns plain roles or namespaced.
      // I will trust the user's "ROLE_" convention request if that's what they set up, 
      // but I'll check for both plain and prefixed to be safe during dev or log it.
      
      setRoles(allRoles);
      
      // Checking precise strings based on user intent
      setIsOrganizer(allRoles.includes("ROLE_ORGANIZER") || allRoles.includes("organizer"));
      setIsAttendee(allRoles.includes("ROLE_ATTENDEE") || allRoles.includes("attendee"));
      setIsStaff(allRoles.includes("ROLE_STAFF") || allRoles.includes("staff"));
      
    } catch (error) {
      console.error("Error parsing JWT: " + error);
      setRoles([]);
      setIsOrganizer(false);
      setIsAttendee(false);
      setIsStaff(false);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthLoading, user?.access_token]);

  return {
    isLoading,
    roles,
    isOrganizer,
    isAttendee,
    isStaff,
  };
};
