import { AppRouteHandler } from "@/lib/types";

import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import db from "@/db";

import { CreateRoute, ListRoute, PatchRoute } from "./branches.routes";
import { branch } from "@/db/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constant";
import { eq, ilike, or } from "drizzle-orm";
import { createPaginatedResponse, getPaginationParams } from "@/lib/pagination-utils";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { page, limit, q, offset } = getPaginationParams(c.req.valid("query"));

  const where = q
    ? or(ilike(branch.name, `%${q}%`), ilike(branch.address, `%${q}%`))
    : undefined;

  const branches = await db.query.branch.findMany({
    limit,
    offset,
    where,
    orderBy: (branch, { desc }) => [desc(branch.createdAt)],
  });

  const total = await db.$count(branch, where);

  return c.json(createPaginatedResponse(branches, total, page, limit));
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const validBranch = c.req.valid("json");
  const [inserted] = await db.insert(branch).values(validBranch).returning();
  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  const [updated] = await db
    .update(branch)
    .set(updates)
    .where(eq(branch.id, id))
    .returning();

  if (!updated) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};
