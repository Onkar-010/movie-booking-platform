/** @format */

import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const theater_staff = pgTable("theater_staff", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  password_hash: varchar("password_hash", { length: 255 }).notNull(),

  password_updated_at: timestamp("password_updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  is_active: boolean("is_active").notNull().default(true),

  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updated_at: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
