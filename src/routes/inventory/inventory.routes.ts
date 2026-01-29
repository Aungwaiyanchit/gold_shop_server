import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
  insertInventorySchema,
  patchInventorySchema,
  selectInventorySchema,
} from "./inventory.schema";
import { notFoundSchema } from "@/lib/constant";
import createErrorSchema from "stoker/openapi/schemas/create-error-schema";
import { IdUUIDParamsSchema } from "stoker/openapi/schemas";

const tags = ["Inventory"];

export const list = createRoute({
  path: "/inventories",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectInventorySchema),
      "The created inventory",
    ),
  },
});

export const create = createRoute({
  path: "/inventories",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(insertInventorySchema, "The inventory to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectInventorySchema,
      "The created inventory",
    ),
  },
});

export const patch = createRoute({
  path: "/inventories/{id}",
  method: "patch",
  tags,
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContentRequired(patchInventorySchema, "The inventory is update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectInventorySchema,
      "The updated Inventory",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Inventory not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchInventorySchema).or(
        createErrorSchema(IdUUIDParamsSchema),
      ),
      "The validation error(s)",
    ),
  },
});

export type PatchRoute = typeof patch;
export type ListRoute = typeof list;
export type CreateRoute = typeof create;
