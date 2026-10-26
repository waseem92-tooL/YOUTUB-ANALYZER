import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import workerHandler from './src/worker.ts';

function workerApiPlugin(): Plugin {
  return {
    name: 'worker-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        try {
          const protocol = req.socket && (req.socket as any).encrypted ? 'https' : 'http';
          const host = req.headers.host || 'localhost:3000';
          const fullUrl = `${protocol}://${host}${req.url}`;

          // Buffer request body for non-GET methods
          let bodyBuffer: Buffer | null = null;
          if (req.method !== 'GET' && req.method !== 'HEAD') {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            }
            bodyBuffer = Buffer.concat(chunks);
          }

          // Build Web Request
          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (value) {
              if (Array.isArray(value)) {
                for (const v of value) headers.append(key, v);
              } else {
                headers.set(key, value);
              }
            }
          }

          const webReq = new Request(fullUrl, {
            method: req.method,
            headers,
            body: bodyBuffer && bodyBuffer.length > 0 ? new Uint8Array(bodyBuffer) : undefined,
          });

          const devEnv = {
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
            YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
            GEMINI_API_KEY: process.env.GEMINI_API_KEY,
            SESSION_SECRET: process.env.SESSION_SECRET || 'dev-hmac-session-secret-key-32chars',
          };

          const workerRes = await workerHandler.fetch(webReq, devEnv, {} as any);

          res.statusCode = workerRes.status;
          workerRes.headers.forEach((val, key) => {
            res.setHeader(key, val);
          });

          const resBody = await workerRes.arrayBuffer();
          res.end(Buffer.from(resBody));
        } catch (err: any) {
          console.error('Error in worker dev middleware:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Worker dev middleware error' }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), workerApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      port: 3000,
      host: '0.0.0.0',
    },
  };
});
