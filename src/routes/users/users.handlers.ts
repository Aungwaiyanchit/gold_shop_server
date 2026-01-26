import { AppRouteHandler } from "@/lib/types";
import { CreateRoute, ListRoute } from "./users.routes";
import db from "@/db";

import { auth } from "@/lib/auth";
import { user } from "@/db/schema";
import { ilike, or } from "drizzle-orm";
import { createPaginatedResponse, getPaginationParams } from "@/lib/pagination-utils";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { page, limit, q, offset } = getPaginationParams(c.req.valid("query"));

  const where = q
    ? or(ilike(user.name, `%${q}%`), ilike(user.email, `%${q}%`))
    : undefined;

  const users = await db.query.user.findMany({
    limit,
    offset,
    where,
    orderBy: (user, { desc }) => [desc(user.createdAt)],
  });

  const total = await db.$count(user, where);

  return c.json(createPaginatedResponse(users, total, page, limit));
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
