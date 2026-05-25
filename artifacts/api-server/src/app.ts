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

  if (process.env.NODE_ENV === "production") {
    const staticDir = path.resolve(import.meta.dirname, "../../cortex-ai/dist/public");
    if (existsSync(staticDir)) {
      app.use(express.static(staticDir));
      app.use((_req, res) => {
        res.sendFile(path.join(staticDir, "index.html"));
      });
      logger.info({ staticDir }, "Serving frontend static files");
    } else {
      logger.warn({ staticDir }, "Frontend static dir not found");
    }
  }

  // Full error chain — shows cause.message (actual PostgreSQL error) not just Drizzle wrapper
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const e = err as Record<string, unknown>;
    logger.error({ err }, "Unhandled error");
    const cause = (e.cause as Record<string,unknown> | undefined);
    res.status(500).json({
      error: String(e.message ?? err),
      cause: cause ? String(cause.message ?? cause) : undefined,
      code: e.code,
    });
  });

  export default app;
  