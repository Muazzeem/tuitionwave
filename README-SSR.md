# Vite SSR Setup

This project now supports Server-Side Rendering (SSR) with Vite.

## Scripts

Since package.json is read-only, manually add these scripts:

```json
{
  "scripts": {
    "dev": "node scripts/dev.js",
    "build": "node scripts/build.js", 
    "build:vercel": "node scripts/build-vercel.js",
    "start": "node server.js",
    "preview": "node server.js"
  }
}
```

## Vercel Deployment

For Vercel deployment:

1. The `vercel.json` configuration is already set up
2. Use `npm run build:vercel` or the build script will be automatically used by Vercel
3. The SSR is handled by the `/api/ssr.js` serverless function
4. Static assets are served from the `dist/client` directory

## Development

1. Start development server with SSR:
```bash
npm run dev
# or directly:
node scripts/dev.js
```

## Production Build

1. Build both client and server:
```bash
npm run build
# or directly:
node scripts/build.js
```

2. Start production server:
```bash
npm start
# or directly:
node server.js
```

## Architecture

- **Client Entry**: `src/entry-client.tsx` - Hydrates the SSR content
- **Server Entry**: `src/entry-server.tsx` - Renders React to string
- **Express Server**: `server.js` - Handles SSR and serves static files
- **Vite Config**: Updated to support dual builds (client + server)

## Features

✅ Server-Side Rendering
✅ Client-side hydration  
✅ SEO-friendly meta tags with react-helmet-async
✅ Development with HMR
✅ Production optimized builds
✅ Static asset serving
✅ Compression middleware

## Environment Variables

- `NODE_ENV=production` - Enables production mode
- `PORT=3000` - Server port (default: 3000)
- `VITE_SSR=true` - Enables SSR build mode

The app now renders on the server for better SEO and faster initial page loads!