import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
  insertSaleSchema,
  patchSaleSchema,
  selectSaleSchema,
} from "./sale.schema";
import { notFoundSchema } from "@/lib/constant";
import createErrorSchema from "stoker/openapi/schemas/create-error-schema";
import { IdUUIDParamsSchema } from "stoker/openapi/schemas";

const tags = ["Sale"];

export const list = createRoute({
  path: "/sales",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectSaleSchema),
      "The created sale",
    ),
  },
});

export const create = createRoute({
  path: "/sales",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(insertSaleSchema, "The sale to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectSaleSchema,
      "The created sale",
    ),
  },
});

export const patch = createRoute({
  path: "/sales/{id}",
  method: "patch",
  tags,
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContentRequired(patchSaleSchema, "The sale is update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectSaleSchema,
      "The updated Sale",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Sale not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchSaleSchema).or(
        createErrorSchema(IdUUIDParamsSchema),
      ),
      "The validation error(s)",
    ),
  },
});

export type PatchRoute = typeof patch;
export type ListRoute = typeof list;
export type CreateRoute = typeof create;
