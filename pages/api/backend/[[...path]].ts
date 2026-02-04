/**
 * Proxy vers le backend Node.js.
 * Permet d'appeler le backend sans exposer son URL côté client.
 * Variable d'environnement : BACKEND_URL (ou NEXT_PUBLIC_API_URL en fallback)
 */
import type { NextApiRequest, NextApiResponse } from "next";

function getBackendBase(): string {
  const url =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";
  return url.replace(/\/$/, "");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const path = (req.query.path as string[]) || [];
  const pathStr = path.length > 0 ? `/${path.join("/")}` : "";
  const query = req.url?.includes("?")
    ? "?" + req.url.split("?")[1]
    : "";

  const backendBase = getBackendBase();
  const targetUrl = `${backendBase}${pathStr}${query}`;

  if (!backendBase || backendBase.includes("localhost:5000")) {
    console.warn(
      "[backend proxy] BACKEND_URL ou NEXT_PUBLIC_API_URL non configuré"
    );
  }

  try {
    const headers: Record<string, string> = {};
    const forwardHeaders = [
      "authorization",
      "content-type",
      "accept",
      "x-requested-with",
    ];
    for (const h of forwardHeaders) {
      const val = req.headers[h];
      if (val && typeof val === "string") headers[h] = val;
    }
    if (!headers["content-type"]) {
      headers["content-type"] = "application/json";
    }

    let body: string | undefined;
    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      body =
        typeof req.body === "string"
          ? req.body
          : headers["content-type"]?.includes("application/json")
            ? JSON.stringify(req.body)
            : undefined;
    }

    const backendRes = await fetch(targetUrl, {
      method: req.method || "GET",
      headers,
      body,
    });

    const text = await backendRes.text();
    res.status(backendRes.status);
    backendRes.headers.forEach((v, k) => {
      if (k.toLowerCase() !== "content-encoding") res.setHeader(k, v);
    });

    try {
      res.json(JSON.parse(text));
    } catch {
      res.send(text);
    }
  } catch (error) {
    console.error("[backend proxy] Erreur:", error);
    res.status(502).json({
      error: "Backend inaccessible",
      message: "Le serveur backend ne répond pas. Vérifiez BACKEND_URL.",
    });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
