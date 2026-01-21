import createApp from "@/lib/create-app";
import configureOpenAPI from "./lib/configure-openapi";


import auth from "@/routes/auth";
import users from "@/routes/users/users.index";

const app = createApp();

configureOpenAPI(app);

const routes = [auth, users] as const;

routes.forEach((route) => {
  app.route("/api", route);
});

export type AppType = (typeof routes)[number];

export default app;
