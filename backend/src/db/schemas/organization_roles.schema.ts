/** @format */

import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";

export const organization_roles = pgTable("organization_roles", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 50 }).notNull().unique(),

  description: text("description"),
});
