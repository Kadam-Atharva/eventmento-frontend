import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const customRedirectUri = process.env.NEXTAUTH_URL + "/callback";

export const authOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: "", // Public client
      issuer: process.env.KEYCLOAK_ISSUER,
      authorization: {
        params: {
            scope: "openid email profile",
            redirect_uri: customRedirectUri, // Force match Keycloak config
        }
      },
      token: {
        params: {
            redirect_uri: customRedirectUri, // Must match authorization redirect_uri
        }
      },
      checks: ['pkce'],
      client: {
        token_endpoint_auth_method: 'none'
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  debug: true, // Enable debug logs
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
