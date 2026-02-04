/**
 * Better Auth - Route API catch-all
 * Gère : sign-in, sign-up, sign-out, get-session, etc.
 */
import { toNodeHandler } from "better-auth/node";
import { auth } from "../../../lib/auth";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = toNodeHandler(auth);

export default async function authHandler(req: any, res: any) {
  try {
    return await handler(req, res);
  } catch (error: any) {
    const msg = error?.message || String(error);
    console.error("[Better Auth] Error:", msg);
    console.error("[Better Auth] Stack:", error?.stack);
    if (error?.cause) console.error("[Better Auth] Cause:", error.cause);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Auth error",
        message: msg,
      });
    }
  }
}
