import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'serve-admin-index',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (!req.url) return next();
          if (req.url === '/admin' || req.url === '/admin/') {
            req.url = '/admin/index.html';
          }
          next();
        });
      },
    },
  ],
  server: {
    host: true,
  },
});
