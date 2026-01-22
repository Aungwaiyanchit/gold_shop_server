import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
  insertBranchSchema,
  patchBranchSchema,
  selectBranchSchema,
} from "./branches.schema";
import { notFoundSchema } from "@/lib/constant";
import createErrorSchema from "stoker/openapi/schemas/create-error-schema";
import { IdUUIDParamsSchema } from "stoker/openapi/schemas";

const tags = ["Branchs"];

export const list = createRoute({
  path: "/branches",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(selectBranchSchema), "Success"),
  },
});

export const create = createRoute({
  path: "/branches",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(insertBranchSchema, "The branch to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectBranchSchema,
      "The created branch",
    ),
  },
});

export const patch = createRoute({
  path: "/branches/{id}",
  method: "patch",
  tags,
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContentRequired(patchBranchSchema, "The updated branch"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectBranchSchema,
      "The updated branch",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Branch not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchBranchSchema).or(
        createErrorSchema(IdUUIDParamsSchema),
      ),
      "The validation error(s)",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type PatchRoute = typeof patch;
