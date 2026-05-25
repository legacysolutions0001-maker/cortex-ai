import express, { type Express, type Request, type Response, type NextFunction } from "express";
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
          return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
        },
        res(res) {
          return { statusCode: res.statusCode };
        },
      },
    }),
  );
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", router);

  // import.meta.dirname in the esbuild bundle = artifacts/api-server/dist/
  // ../../cortex-ai/dist/public             = artifacts/cortex-ai/dist/public
  if (process.env.NODE_ENV === "production") {
    const staticDir = path.resolve(import.meta.dirname, "../../cortex-ai/dist/public");
    if (existsSync(staticDir)) {
      app.use(express.static(staticDir));
      // SPA fallback: app.use() — Express 5 does not accept app.get("*", ...)
      app.use((_req, res) => {
        res.sendFile(path.join(staticDir, "index.html"));
      });
      logger.info({ staticDir }, "Serving frontend static files");
    } else {
      logger.warn({ staticDir }, "Frontend static dir not found");
    }
  }

  // JSON error handler — returns the actual error message so we can diagnose DB issues
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error({ err }, "Unhandled error");
    res.status(500).json({ error: err.message ?? "Internal Server Error" });
  });

  export default app;
  