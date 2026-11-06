/** @format */

import { pgTable, uuid, varchar, unique, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const refresh_token = pgTable("refresh_token", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token_hash: varchar({ length: 64 }).notNull().unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
  revoked_at: timestamp("revoked_at", { withTimezone: true }),

  /** replaced_by_token_id
   *
   * Token rotation tracking: follow the chain of replacements.
   * Reuse detection: identify that A was already replaced when it is presented again.
   * Auditing: investigate the sequence of refresh-token rotations.
   *
   */
  replaced_by_token_id: uuid("replaced_by_token_id").references(
    (): any => refresh_token.id,
    { onDelete: "set null" },
  ),

  family_id: uuid("family_id").notNull(),
});
