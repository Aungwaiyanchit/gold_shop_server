import { pgTable, uuid, text, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { relations } from "drizzle-orm";

export const inventory = pgTable("inventory", {
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

export const inventory_batch = pgTable("inventory_batch", {
  id: uuid("id").primaryKey().defaultRandom(),
  totalItemAmount: decimal("total_item_amount").default("0"),
  inventoryId: uuid("inventory_id")
    .notNull()
    .references(() => inventory.id),
  totalCost: decimal("total_cost").default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const inventory_item = pgTable("inventory_item", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(),
  itemAmount: decimal("item_amount").default("0"),
  priceRate: decimal("price_rate").default("0"),
  newPriceRate: decimal("new_price_rate").default("0"),
  remark: text("remark"),
  inventoryBatchId: uuid("inventory_batch_id")
    .notNull()
    .references(() => inventory_batch.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const inventoryRelations = relations(inventory, ({ many }) => ({
  inventory_batches: many(inventory_batch),
}));

export const inventoryBatchRelations = relations(
  inventory_batch,
  ({ many, one }) => ({
    inventory: one(inventory, {
      fields: [inventory_batch.inventoryId],
      references: [inventory.id],
    }),
    inventory_items: many(inventory_item),
  }),
);

export const inventoryItemRelations = relations(inventory_item, ({ one }) => ({
  inventory_batch: one(inventory_batch, {
    fields: [inventory_item.inventoryBatchId],
    references: [inventory_batch.id]
  })
}))
