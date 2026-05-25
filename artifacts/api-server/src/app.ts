import express, { type Express } from "express";
  import cors from "cors";
  import pinoHttp from "pino-http";
  import path from "path";
  import { existsSync } from "fs";
  import router from "./routes";
  import { logger } from "./lib/logger";

  const app: Express = express();

  app.use(
    pinoHttp({
      logger,
      serializers: {
        req(req) {
          return {
            id: req.id,
            method: req.method,
            url: req.url?.split("?")[0],
          };
        },
        res(res) {
          return {
            statusCode: res.statusCode,
          };
        },
      },
    }),
  );
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", router);

  // Serve the built React frontend in production
  // import.meta.dirname = .../artifacts/api-server/dist/
  // ../../cortex-ai/dist/public = .../artifacts/cortex-ai/dist/public
  if (process.env.NODE_ENV === "production") {
    const staticDir = path.resolve(import.meta.dirname, "../../cortex-ai/dist/public");
    if (existsSync(staticDir)) {
      app.use(express.static(staticDir));
      // SPA fallback — all non-API routes return index.html
      app.get("*", (_req, res) => {
        res.sendFile(path.join(staticDir, "index.html"));
      });
      logger.info({ staticDir }, "Serving frontend static files");
    } else {
      logger.warn({ staticDir }, "Frontend static dir not found — skipping static serving");
    }
  }

  export default app;
  