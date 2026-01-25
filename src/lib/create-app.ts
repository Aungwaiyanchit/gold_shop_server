import { OpenAPIHono } from "@hono/zod-openapi";
import { AppBindings } from "./types";
import { defaultHook } from "stoker/openapi";
import { notFound, onError } from "stoker/middlewares";
import { pinoLogger } from "@/middlewares/pino-logger";
import { cors } from "hono/cors";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();

  app.use(pinoLogger())
  .use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }));

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
