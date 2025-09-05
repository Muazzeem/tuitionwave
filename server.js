import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 8080;

async function createServer() {
  const app = express();

  let vite;
  if (!isProd) {
    // --- DEV: use Vite middleware with HMR ---
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    // --- PROD: serve built assets from dist ---
    app.use(express.static(path.resolve(__dirname, "dist/client")));
  }

  // Catch-all for SSR / SPA fallback
  app.use(/.*/, async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template, render;

      if (!isProd) {
        // --- DEV ---
        template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render;
      } else {
        // --- PROD ---
        template = fs.readFileSync(path.resolve(__dirname, "dist/client/index.html"), "utf-8");
        render = (await import("./dist/server/entry-server.js")).render;
      }

      // Render app HTML
      const appHtml = await render(url);

      // Inject app into template
      const html = template.replace(`<!--ssr-outlet-->`, appHtml);

      // Send back response
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      if (vite) vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}

createServer();
