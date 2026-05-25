import app from "./app";
  import { logger } from "./lib/logger";
  import { runMigrations } from "./routes/health";

  const rawPort = process.env["PORT"];
  if (!rawPort) throw new Error("PORT is required");
  const port = Number(rawPort);
  if (Number.isNaN(port) || port <= 0) throw new Error(`Invalid PORT: "${rawPort}"`);

  app.listen(port, () => {
    logger.info({ port }, "Server listening");
    if (process.env.DATABASE_URL) {
      runMigrations()
        .then(result => {
          if (result.ok) logger.info({ tables: result.tables }, "DB migration complete");
          else logger.error({ error: result.error }, "DB migration failed — server still running");
        })
        .catch(err => logger.error({ err }, "Unexpected migration error"));
    }
  });
  