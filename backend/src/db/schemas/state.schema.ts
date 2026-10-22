/** @format */

import { pgTable, uuid, varchar, unique } from "drizzle-orm/pg-core";
import { country } from "./country.schema";

export const state = pgTable(
  "state",
  {
    id: uuid().primaryKey().defaultRandom(),
    state_name: varchar({ length: 255 }).notNull(),
    country_id: uuid("country_id")
      .notNull()
      .references(() => country.id, { onDelete: "restrict" }),
  },
  (t) => [unique().on(t.country_id, t.state_name)],
);
