import { useState, useEffect } from 'react';
import { useAuth } from "react-oidc-context";
import { getCurrentUser } from '@/domain/domain';

export const useCurrentUser = () => {
    const auth = useAuth();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (auth.isAuthenticated && auth.user?.access_token) {
                try {
                    const userData = await getCurrentUser(auth.user.access_token);
                    console.log("Fetched User Data (check for profileImage):", userData);
                    setUser(userData);
                } catch (err) {
                    console.error("Failed to fetch user profile:", err);
                    setError(err);
                } finally {
                    setIsLoading(false);
                }
            } else if (!auth.isLoading) {
                 setIsLoading(false);
            }
        };

        fetchUser();
    }, [auth.isAuthenticated, auth.user?.access_token, auth.isLoading]);

    return { user, isLoading, error };
};
