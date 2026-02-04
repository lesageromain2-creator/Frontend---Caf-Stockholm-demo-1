// frontend/lib/auth-client.js
"use client";

import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

const baseURL = typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL,
  basePath: "/api/auth",
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect() {
        if (typeof window !== "undefined") {
          window.location.href = "/auth/2fa";
        }
      },
    }),
  ],
});

// Export des hooks
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  useUser,
} = authClient;