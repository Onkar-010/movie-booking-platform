/** @format */

import { pgTable, uuid, varchar, timestamp, index } from "drizzle-orm/pg-core";

import { users } from "./users.schema";

export const emailVerificationTokens = pgTable(
  "email_verification_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    token_hash: varchar("token_hash", {
      length: 64,
    })
      .notNull()
      .unique(),

    expires_at: timestamp("expires_at", {
      withTimezone: true,
    }).notNull(),

    used_at: timestamp("used_at", {
      withTimezone: true,
    }),

    created_at: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("email_verification_tokens_user_id_idx").on(table.user_id)],
);
