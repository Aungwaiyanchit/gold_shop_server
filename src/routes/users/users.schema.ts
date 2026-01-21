import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { user } from "@/db/schema";
import { toZodV4SchemaTyped } from "@/lib/zod-utils";
import { z } from "@hono/zod-openapi";

export const selectUsersSchema = toZodV4SchemaTyped(createSelectSchema(user));
export const insertUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string()
})
