import { inventory } from "@/db/schema";
import { toZodV4SchemaTyped } from "@/lib/zod-utils";
import { z } from "@hono/zod-openapi";
import { createSelectSchema } from "drizzle-zod";

const inventoryItemSchema = z.object({
  type: z.string(),
  itemAmount: z.string(),
  priceRate: z.string(),
  newPriceRate: z.string(),
  remark: z.string().nullable(),
});

const inventoryBatchSchema = z.object({
  totalItemAmount: z.string(),
  totalCost: z.string(),
  items: z.array(inventoryItemSchema)
});

export const insertInventorySchema = z.object({
  supplier: z.string().openapi({ example: "U Mya"}),
  totalItemAmount: z.string(),
  totalCost: z.string(),
  inventoryBatches: z.array(inventoryBatchSchema)
});

export const selectInventorySchema = toZodV4SchemaTyped(createSelectSchema(inventory));
export const patchInventorySchema = insertInventorySchema.partial();

