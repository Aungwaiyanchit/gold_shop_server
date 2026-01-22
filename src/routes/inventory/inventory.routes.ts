import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
  insertInventorySchema,
  selectInventorySchema,
} from "./inventory.schema";

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

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
