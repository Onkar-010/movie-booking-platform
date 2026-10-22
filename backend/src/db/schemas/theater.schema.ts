/** @format */

import {
  pgTable,
  uuid,
  varchar,
  decimal,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { city } from "./city.schema";

export const theater = pgTable(
  "theater",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    city_id: uuid("city_id")
      .notNull()
      .references(() => city.id, { onDelete: "restrict" }),
    address: varchar({ length: 500 }).notNull(),
    pincode: varchar({ length: 6 }).notNull(),
    latitude: decimal({ precision: 9, scale: 6 }).notNull(),
    longitude: decimal({ precision: 9, scale: 6 }).notNull(),
    is_active: boolean().notNull().default(true),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("theater_city_idx").on(t.city_id)],
);
