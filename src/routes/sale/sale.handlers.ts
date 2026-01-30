import { AppRouteHandler } from "@/lib/types";
import { CreateRoute, ListRoute, PatchRoute } from "./sale.routes";
import db from "@/db";
import { sale, sale_batch, sale_item } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

import * as HttpStatusCodes from "stoker/http-status-codes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const data = await db.query.sale.findMany({
    with: {
      sale_batches: {
        with: {
          sale_items: true,
        },
      },
    },
  });
  return c.json(data, 200);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const validSale = c.req.valid("json");
  const { supplier, totalItemAmount, totalCost, saleBatches } =
    validSale;

  const user = c.get("user");

  const insertedSale = await db.transaction(async (tx) => {
    const [insertedSale] = await tx
      .insert(sale)
      .values({
        supplier,
        totalItemAmount,
        totalCost,
        createdBy: user!.id,
      })
      .returning();

    for (const batch of saleBatches) {
      const [insertedBatch] = await tx
        .insert(sale_batch)
        .values({
          saleId: insertedSale.id,
          totalItemAmount: batch.totalItemAmount,
          totalCost: batch.totalCost,
        })
        .returning();

      if (batch.items.length > 0) {
        await tx.insert(sale_item).values(
          batch.items.map((item) => ({
            saleBatchId: insertedBatch.id,
            ...item,
          })),
        );
      }
    }

    return insertedSale;
  });

  return c.json(insertedSale);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const saleId = c.req.param("id");
  const validSale = c.req.valid("json");

  const { supplier, totalItemAmount, totalCost, saleBatches } =
    validSale;

  const updatedSale = await db.transaction(async (tx) => {

    const [saleResult] = await tx
      .update(sale)
      .set({
        supplier,
        totalItemAmount,
        totalCost,
      })
      .where(eq(sale.id, saleId))
      .returning();

    if (saleBatches) {
      await tx
        .delete(sale_item)
        .where(
          inArray(
            sale_item.saleBatchId,
            tx
              .select({ id: sale_batch.id })
              .from(sale_batch)
              .where(eq(sale_batch.saleId, saleId)),
          ),
        );

      await tx
        .delete(sale_batch)
        .where(eq(sale_batch.saleId, saleId));

      for (const batch of saleBatches) {
        const [insertedBatch] = await tx
          .insert(sale_batch)
          .values({
            saleId,
            totalItemAmount: batch.totalItemAmount,
            totalCost: batch.totalCost,
          })
          .returning();

        if (batch.items?.length) {
          await tx.insert(sale_item).values(
            batch.items.map((item) => ({
              saleBatchId: insertedBatch.id,
              ...item,
            })),
          );
        }
      }
    }

    return saleResult;
  });

  if (!updatedSale) {
    return c.json(
      { message: "Sale not found" },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updatedSale, HttpStatusCodes.OK);
};
