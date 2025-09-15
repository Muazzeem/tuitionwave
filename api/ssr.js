// api/ssr.js
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Vercel bundles only the function's folder by default,
// so we explicitly include the dist files via vercel.json (includeFiles).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, ".."); // project root at deploy
const distClient = path.join(root, "dist", "client");
const distServer = path.join(root, "dist", "server");

// Preload template and SSR module once per lambda instance
let template;
let render;

// Optional: pin runtime + bundle files
export const config = {
  runtime: "nodejs",
};

async function ensureLoaded() {
  if (!template) {
    template = await fs.readFile(path.join(distClient, "index.html"), "utf-8");
  }
  if (!render) {
    // Dynamic import of the server bundle - try both .js and .mjs extensions
    try {
      const mod = await import(path.join(distServer, "entry-server.js"));
      render = mod.render;
    } catch (e) {
      // Fallback to .mjs if .js doesn't exist
      const mod = await import(path.join(distServer, "entry-server.mjs"));
      render = mod.render;
    }
  }
}

export default async function handler(req, res) {
  try {
    await ensureLoaded();

    const url = req.url || "/";
    const appHtml = await render(url);
    const html = template.replace("<!--ssr-outlet-->", appHtml);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).end(html);
  } catch (e) {
    console.error(e);
    res.status(500).end("Internal Server Error");
  }
}
