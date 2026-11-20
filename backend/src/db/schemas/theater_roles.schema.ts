/** @format */

import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";

export const theater_roles = pgTable("theater_roles", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 50 }).notNull().unique(),

  description: text("description"),
});
