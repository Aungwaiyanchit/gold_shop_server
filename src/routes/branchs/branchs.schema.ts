import { branch } from "@/db/schema";
import { toZodV4SchemaTyped } from "@/lib/zod-utils";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const insertBranchSchemaRaw = createInsertSchema(branch).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectBranchSchema = toZodV4SchemaTyped(
  createSelectSchema(branch),
);
export const insertBranchSchema = toZodV4SchemaTyped(insertBranchSchemaRaw);
export const patchBranchSchema = insertBranchSchemaRaw.partial();
