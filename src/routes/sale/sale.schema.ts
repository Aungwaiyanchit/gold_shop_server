import { sale } from "@/db/schema";
import { toZodV4SchemaTyped } from "@/lib/zod-utils";
import { z } from "@hono/zod-openapi";
import { createSelectSchema } from "drizzle-zod";

const saleItemSchema = z.object({
  type: z.string(),
  itemAmount: z.string(),
  priceRate: z.string(),
  newPriceRate: z.string(),
  remark: z.string().nullable(),
});

const saleBatchSchema = z.object({
  totalItemAmount: z.string(),
  totalCost: z.string(),
  items: z.array(saleItemSchema)
});

export const insertSaleSchema = z.object({
  supplier: z.string().openapi({ example: "U Mya"}),
  totalItemAmount: z.string(),
  totalCost: z.string(),
  saleBatches: z.array(saleBatchSchema)
});

export const selectSaleSchema = toZodV4SchemaTyped(createSelectSchema(sale));
export const patchSaleSchema = insertSaleSchema.partial();

