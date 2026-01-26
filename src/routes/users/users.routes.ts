import { createRoute, z } from "@hono/zod-openapi";
import { insertUserSchema, selectUsersSchema } from "./users.schema";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { paginationMetaSchema, paginationSchema } from "@/lib/constant";

const tags = ["Users"];

export const list = createRoute({
  path: "/users",
  method: "get",
  tags,
  request: {
    query: paginationSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        data: z.array(selectUsersSchema),
        meta: paginationMetaSchema,
      }),
      "Success",
    ),
  },
});

export const create = createRoute({
  path: "/users",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(insertUserSchema, "The user to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectUsersSchema,
      "The created user",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      z.object({
        message: z.string().openapi({ example: "User already exists" }),
      }),
      "The duplicate user",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
