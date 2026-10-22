/** @format */

import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const country = pgTable("country", {
  id: uuid().primaryKey().defaultRandom(),
  country_name: varchar({ length: 255 }).notNull().unique(),
});
