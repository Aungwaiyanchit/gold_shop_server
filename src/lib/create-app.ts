import { OpenAPIHono } from "@hono/zod-openapi";
import { AppBindings } from "./types";
import { defaultHook } from "stoker/openapi";
import { notFound, onError } from "stoker/middlewares";
import { pinoLogger } from "@/middlewares/pino-logger";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();

  app.use(pinoLogger());

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
