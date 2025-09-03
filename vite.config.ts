import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ command, mode }) => {
  const isSSRBuild = process.env.VITE_SSR === 'true';
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: isSSRBuild ? {
      // SSR build configuration
      ssr: true,
      outDir: 'dist/server',
      rollupOptions: {
        input: 'src/entry-server.tsx',
        output: {
          format: 'es'
        }
      }
    } : {
      // Client build configuration
      outDir: 'dist/client',
      rollupOptions: {
        input: 'src/entry-client.tsx'
      }
    }
  };
});
