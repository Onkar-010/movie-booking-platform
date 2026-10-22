/** @format */

import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).unique().notNull(),
  password_hash: varchar({ length: 255 }).notNull(),
  password_updated_at: timestamp("password_updated_at").defaultNow().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
