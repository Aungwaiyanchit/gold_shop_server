import { Scalar } from "@scalar/hono-api-reference";

import type { AppOpenAPI } from "./types";

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0",
      title: "Gold Shop Managment API",
    },
  });

  app.get(
    "/reference",
    Scalar({
      url: "/doc",
      theme: "elysiajs",
      pageTitle: "API Reference",
      layout: "morden",
      sources: [
        { url: "/doc", title: "API" },
        { url: "/api/auth/open-api/generate-schema", title: "Auth" },
      ],
      defaultHttpClient: {
        targetKey: "js",
        clientKey: "fetch",
      },
    }),
  );
}
