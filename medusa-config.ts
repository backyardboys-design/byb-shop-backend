import path from "path";
import { loadEnv, defineConfig, Modules } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    databaseDriverOptions: {
      ssl: false,
      sslmode: "disable",
    },
    workerMode: process.env.MEDUSA_WORKER_MODE as
      | "shared"
      | "worker"
      | "server",
    http: {
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
      authCors: process.env.AUTH_CORS,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
              upload_dir: "static",
              backend_url: "https://api.backyardboys.at/static",
            },
          },
        ],
      },
    },
  ],

  admin: {
    backendUrl: "https://api.backyardboys.at",
    vite: () => ({
      resolve: {
        alias: {
          "/src": path.resolve(process.cwd(), "src"),
        },
      },
      server: {
        host: "0.0.0.0",
        allowedHosts: [
          "api.backyardboys.at",
          "localhost",
          ".localhost",
          "127.0.0.1",
        ],
      },
    }),
  },
});
