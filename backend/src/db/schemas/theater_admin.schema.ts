/** @format */

import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { theater } from "./theater.schema";

export const theater_admin = pgTable(
  "theater_admin",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    theater_id: uuid("theater_id")
      .notNull()
      .references(() => theater.id, { onDelete: "restrict" }),
    password_hash: varchar({ length: 255 }).notNull(),
    password_updated_at: timestamp("password_updated_at")
      .defaultNow()
      .notNull(),
    is_active: boolean().notNull().default(true),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("theater_admin_theater_idx").on(t.theater_id)],
);
