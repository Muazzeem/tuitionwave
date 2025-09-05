import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import the server entry point
let render;

export default async function handler(req, res) {
  const url = req.url;

  try {
    // Load the server bundle
    if (!render) {
      const serverEntry = await import("../dist/server/entry-server.js");
      render = serverEntry.render;
    }

    // Read the client HTML template
    const template = fs.readFileSync(
      path.resolve(__dirname, "../dist/client/index.html"),
      "utf-8"
    );

    // Render the app
    const appHtml = await render(url);

    // Inject the app HTML into the template
    const html = template.replace("<!--ssr-outlet-->", appHtml);

    // Set proper headers
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (error) {
    console.error("SSR Error:", error);
    
    // Fallback to client-side rendering
    const template = fs.readFileSync(
      path.resolve(__dirname, "../dist/client/index.html"),
      "utf-8"
    );
    
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(template);
  }
}