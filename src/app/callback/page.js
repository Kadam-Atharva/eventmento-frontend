"use client";
import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (auth.isAuthenticated) {
            router.push("/dashboard");
        }
        if (auth.error) {
            console.error("Auth error:", auth.error);
        }
    }, [auth.isAuthenticated, auth.error, router]);

    if (auth.error) {
        return <div>Error loading auth: {auth.error.message}</div>;
    }

    if (auth.isLoading) {
        return <div>Loading authentication...</div>;
    }

    return <div>Processing login...</div>;
}
