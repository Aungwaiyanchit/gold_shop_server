import { pgTable, uuid, text, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { relations } from "drizzle-orm";

export const sale = pgTable("sale", {
  id: uuid("id").primaryKey().defaultRandom(),
  supplier: text("supplier").notNull(),
  totalItemAmount: decimal("total_item_amount").default("0"),
  totalCost: decimal("total_cost").default("0"),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  isDeleted: boolean("is_deleted").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const sale_batch = pgTable("sale_batch", {
  id: uuid("id").primaryKey().defaultRandom(),
  totalItemAmount: decimal("total_item_amount").default("0"),
  saleId: uuid("sale_id")
    .notNull()
    .references(() => sale.id),
  totalCost: decimal("total_cost").default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const sale_item = pgTable("sale_item", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(),
  itemAmount: decimal("item_amount").default("0"),
  priceRate: decimal("price_rate").default("0"),
  newPriceRate: decimal("new_price_rate").default("0"),
  remark: text("remark"),
  saleBatchId: uuid("sale_batch_id")
    .notNull()
    .references(() => sale_batch.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const saleRelations = relations(sale, ({ many }) => ({
  sale_batches: many(sale_batch),
}));

export const saleBatchRelations = relations(
  sale_batch,
  ({ many, one }) => ({
    sale: one(sale, {
      fields: [sale_batch.saleId],
      references: [sale.id],
    }),
    sale_items: many(sale_item),
  }),
);

export const saleItemRelations = relations(sale_item, ({ one }) => ({
  sale_batch: one(sale_batch, {
    fields: [sale_item.saleBatchId],
    references: [sale_batch.id]
  })
}))
