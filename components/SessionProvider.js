// frontend/components/SessionProvider.js
"use client";

import { authClient } from "../lib/auth-client";

export function SessionProvider({ children }) {
  return (
    <authClient.Provider>
      {children}
    </authClient.Provider>
  );
}