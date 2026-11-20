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
import { theater } from "./theater.schema";
import { theater_roles } from "./theater_roles.schema";

export const theater_staff_assignments = pgTable(
  "theater_staff_assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    staff_id: uuid("staff_id")
      .notNull()
      .references(() => theater_staff.id, { onDelete: "restrict" }),

    theater_id: uuid("theater_id")
      .notNull()
      .references(() => theater.id, { onDelete: "restrict" }),

    status: varchar("status", { length: 30 }).notNull().default("ACTIVE"),

    theater_role_id: uuid("theater_role_id")
      .notNull()
      .references(() => theater_roles.id, {
        onDelete: "restrict",
      }),

    assigned_at: timestamp("assigned_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    unique("theater_staff_assignment_unique").on(t.staff_id, t.theater_id),
    index("theater_staff_assignment_theater_idx").on(t.theater_id),
  ],
);
