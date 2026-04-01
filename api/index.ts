import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, normalize, resolve } from "node:path";

const clientDir = resolve(process.cwd(), "dist/client");

// @ts-ignore
import serverEntry from "../dist/server/server.js";

const MIME_TYPES: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
  ".pdf": "application/pdf",
};

function getContentType(filePath: string) {
  return MIME_TYPES[extname(filePath).toLowerCase()] || "application/octet-stream";
}

function resolveStaticFile(pathname: string) {
  const decoded = decodeURIComponent(pathname);
  const normalized = normalize(decoded).replace(/^[/\\]+/, "");
  const absolutePath = resolve(clientDir, normalized);
  if (!absolutePath.startsWith(clientDir)) return null;
  if (!existsSync(absolutePath)) return null;
  const stats = statSync(absolutePath);
  if (!stats.isFile()) return null;
  return absolutePath;
}

function toHeaders(nodeHeaders: Record<string, string | string[] | undefined>) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(nodeHeaders)) {
    if (typeof value === "undefined") continue;
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item);
    } else {
      headers.set(key, value);
    }
  }
  return headers;
}

export default async function handler(req: any, res: any) {
  try {
    const hostHeader = req.headers.host || "localhost:3000";
    const protocol = (req.headers["x-forwarded-proto"] || "https").toString().split(",")[0].trim();
    const url = new URL(req.url || "/", `${protocol}://${hostHeader}`);

    // Try static file first
    if (url.pathname && !url.pathname.endsWith("/")) {
      const filePath = resolveStaticFile(url.pathname);
      if (filePath) {
        res.statusCode = 200;
        res.setHeader("Content-Type", getContentType(filePath));
        if (url.pathname.startsWith("/assets/")) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else {
          res.setHeader("Cache-Control", "public, max-age=3600");
        }
        if (req.method === "HEAD") {
          res.end();
          return;
        }
        createReadStream(filePath).pipe(res);
        return;
      }
    }

    // Fall through to SSR
    const method = (req.method || "GET").toUpperCase();
    const init: RequestInit = {
      method,
      headers: toHeaders(req.headers as Record<string, string | string[] | undefined>),
    };

    if (method !== "GET" && method !== "HEAD" && req.body) {
      init.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    }

    const request = new Request(url.toString(), init);
    const response = await serverEntry.fetch(request);

    res.statusCode = response.status;
    response.headers.forEach((value: string, key: string) => {
      if (key.toLowerCase() === "set-cookie") {
        const existing = res.getHeader("set-cookie");
        if (Array.isArray(existing)) {
          res.setHeader("set-cookie", [...existing, value]);
        } else if (existing) {
          res.setHeader("set-cookie", [String(existing), value]);
        } else {
          res.setHeader("set-cookie", value);
        }
      } else {
        res.setHeader(key, value);
      }
    });

    if (method === "HEAD" || !response.body) {
      res.end();
      return;
    }

    const reader = response.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (error) {
    console.error("Server error:", error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
    }
    res.end("Internal Server Error");
  }
}
