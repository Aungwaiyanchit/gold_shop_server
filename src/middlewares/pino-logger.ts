import { env } from "bun";
import { pinoLogger as logger } from "hono-pino";
import { pino } from "pino";
import pretty = require("pino-pretty");

export function pinoLogger() {
  return logger({
    pino: pino(
      {
        level: process.env.LOG_LEVEL || "info",
      },
      env.NODE_ENV === "production" ? undefined : pretty(),
    ),
  });
}
