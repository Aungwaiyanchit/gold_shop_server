import { AppRouteHandler } from "@/lib/types";
import { CreateRoute, ListRoute, PatchRoute } from "./inventory.routes";
import db from "@/db";
import { inventory, inventory_batch, inventory_item } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

import * as HttpStatusCodes from "stoker/http-status-codes";

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
  const { supplier, totalItemAmount, totalCost, inventoryBatches } =
    validInventory;

  const user = c.get("user");

  const insertedInventory = await db.transaction(async (tx) => {
    const [insertedInventory] = await tx
      .insert(inventory)
      .values({
        supplier,
        totalItemAmount,
        totalCost,
        createdBy: user!.id,
      })
      .returning();

    for (const batch of inventoryBatches) {
      const [insertedBatch] = await tx
        .insert(inventory_batch)
        .values({
          inventoryId: insertedInventory.id,
          totalItemAmount: batch.totalItemAmount,
          totalCost: batch.totalCost,
        })
        .returning();

      if (batch.items.length > 0) {
        await tx.insert(inventory_item).values(
          batch.items.map((item) => ({
            inventoryBatchId: insertedBatch.id,
            ...item,
          })),
        );
      }
    }

    return insertedInventory;
  });

  return c.json(insertedInventory);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const inventoryId = c.req.param("id");
  const validInventory = c.req.valid("json");

  const { supplier, totalItemAmount, totalCost, inventoryBatches } =
    validInventory;

  const updatedInventory = await db.transaction(async (tx) => {

    const [inventoryResult] = await tx
      .update(inventory)
      .set({
        supplier,
        totalItemAmount,
        totalCost,
      })
      .where(eq(inventory.id, inventoryId))
      .returning();

    if (inventoryBatches) {
      await tx
        .delete(inventory_item)
        .where(
          inArray(
            inventory_item.inventoryBatchId,
            tx
              .select({ id: inventory_batch.id })
              .from(inventory_batch)
              .where(eq(inventory_batch.inventoryId, inventoryId)),
          ),
        );

      await tx
        .delete(inventory_batch)
        .where(eq(inventory_batch.inventoryId, inventoryId));

      for (const batch of inventoryBatches) {
        const [insertedBatch] = await tx
          .insert(inventory_batch)
          .values({
            inventoryId,
            totalItemAmount: batch.totalItemAmount,
            totalCost: batch.totalCost,
          })
          .returning();

        if (batch.items?.length) {
          await tx.insert(inventory_item).values(
            batch.items.map((item) => ({
              inventoryBatchId: insertedBatch.id,
              ...item,
            })),
          );
        }
      }
    }

    return inventoryResult;
  });

  if (!updatedInventory) {
    return c.json(
      { message: "Inventory not found" },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updatedInventory, HttpStatusCodes.OK);
};
