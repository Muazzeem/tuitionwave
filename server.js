import express from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import compression from 'compression';
import serveStatic from 'serve-static';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

const app = express();

// Enable gzip compression
app.use(compression());

let vite;
if (!isProduction) {
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });
  app.use(vite.ssrLoadModule);
} else {
  app.use(serveStatic(resolve(__dirname, 'dist/client'), {
    index: false
  }));
}

app.use('*', async (req, res, next) => {
  try {
    const url = req.originalUrl;

    let template, render;
    if (!isProduction) {
      // Development: always read template from file system
      template = readFileSync(resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
    } else {
      // Production: use built assets
      template = readFileSync(resolve(__dirname, 'dist/client/index.html'), 'utf-8');
      render = (await import('./dist/server/entry-server.js')).render;
    }

    const { html: appHtml, helmet } = render(url);

    // Replace template placeholders with SSR content
    const html = template
      .replace('<!--ssr-head-->', `
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        ${helmet.script.toString()}
      `)
      .replace('<!--ssr-outlet-->', appHtml);

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  } catch (e) {
    if (!isProduction) {
      vite.ssrFixStacktrace(e);
    }
    console.error(e);
    res.status(500).end(e.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});