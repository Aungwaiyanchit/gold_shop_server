import { AppRouteHandler } from "@/lib/types";
import { CreateRoute, ListRoute } from "./users.routes";
import db from "@/db";

import { auth } from "@/lib/auth";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const users = await db.query.user.findMany();
  return c.json(users);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const validUser = c.req.valid("json");
  const { email, name, password } = validUser;
  const inserted = await auth.api.createUser({
    body: {
      name,
      email,
      password,
    },
  });
  const data = JSON.parse(JSON.stringify(inserted.user));
  return c.json(data, 201);
};
