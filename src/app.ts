import createApp from "@/lib/create-app";
import configureOpenAPI from "./lib/configure-openapi";
import { authMiddleware } from "./middlewares/auth";

import auth from "@/routes/auth";
import users from "@/routes/users/users.index";
import branchs from "@/routes/branchs/branchs.index";

const app = createApp();

configureOpenAPI(app);

const routes = [auth, users, branchs] as const;

app.use("/api/*", async (c, next) => {
  if (c.req.path.startsWith("/api/auth")) {
    return next();
  }
  return authMiddleware(c, next);
});

routes.forEach((route) => {
  app.route("/api", route);
});

export type AppType = (typeof routes)[number];

export default app;
