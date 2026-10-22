/** @format */

import { pgTable, uuid, varchar, unique } from "drizzle-orm/pg-core";
import { state } from "./state.schema";

export const city = pgTable("city", {
  id: uuid().primaryKey().defaultRandom(),
  city_name: varchar({ length: 255 }).notNull(),
  state_id: uuid("state_id")
    .notNull()
    .references(() => state.id, { onDelete: "restrict" }),
});
