"use client";
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";
import { useRouter } from "next/navigation";

const onSigninCallback = (_user) => {
    window.history.replaceState({}, document.title, window.location.pathname);
};

export default function AuthWrapper({ children }) {
  const router = useRouter();

  const oidcConfig = {
    authority: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER,
    client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
    redirect_uri: process.env.NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI,
    onSigninCallback: onSigninCallback,
    userStore: typeof window !== 'undefined' ? new WebStorageStateStore({ store: window.sessionStorage }) : undefined,
  };

  return <AuthProvider {...oidcConfig}>{children}</AuthProvider>;
}
