/** @format */

import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  unique,
  index,
} from "drizzle-orm/pg-core";

import { theater_staff } from "./theater_staff.schema";
import { organizations } from "./organizations.schema";
import { organization_roles } from "./organization_roles.schema";

export const organization_memberships = pgTable(
  "organization_memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organization_id: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "restrict" }),

    staff_id: uuid("staff_id")
      .notNull()
      .references(() => theater_staff.id, { onDelete: "restrict" }),

    organization_role_id: uuid("organization_role_id")
      .notNull()
      .references(() => organization_roles.id, {
        onDelete: "restrict",
      }),

    status: varchar("status", { length: 30 }).notNull().default("ACTIVE"),

    joined_at: timestamp("joined_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    unique("organization_staff_unique").on(t.organization_id, t.staff_id),
    index("organization_membership_staff_idx").on(t.staff_id),
  ],
);
