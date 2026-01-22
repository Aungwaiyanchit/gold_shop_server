import { AppRouteHandler } from "@/lib/types";
import { CreateRoute, ListRoute } from "./inventory.routes";
import db from "@/db";
import { inventory, inventory_batch, inventory_item } from "@/db/schema";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const data = await db.query.inventory.findMany({
    with: {
      inventory_batches: {
        with: {
          inventory_items: true,
        },
      },
    },
  });
  return c.json(data, 200);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const validInventory = c.req.valid("json");
  const { supplier, inventoryBatches } = validInventory;

  const user = c.get("user");

  const insertedInventory = await db.transaction(async (tx) => {
    const [insertedInventory] = await tx
      .insert(inventory)
      .values({
        supplier,
        createdBy: user!.id,
      })
      .returning();

    for (const batch of inventoryBatches) {
      const [insertedBatch] = await tx
        .insert(inventory_batch)
        .values({
          inventoryId: insertedInventory.id,
        })
        .returning();

      if (batch.items.length > 0) {
        await tx.insert(inventory_item).values(
          batch.items.map((item) => ({
            inventoryBatchId: insertedBatch.id,
            ...item,
          }))
        );
      }
    }

    return insertedInventory;
  });

  return c.json(insertedInventory);
};
