/** @format */

// Before Transaction implemented

// import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import { config } from "./index";
//New Imports
import ws from "ws";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

/**
 * What it does:
 * Creates a Neon client using the database URL.
 * The client is used to send SQL queries to Neon PostgreSQL.
 */

// Called: Low-level database client (driver client)
// const neonClient = neon(config.postgres.url);

/**
 * What it does:
 * Initializes Drizzle ORM using the Neon client.
 * Drizzle builds and executes queries, while the Neon client
 * handles communication with the Neon database.
 */

// Called: Drizzle ORM instance using the Neon HTTP adapter
// const db = drizzle({ client: neonClient });

/**
 * What it does:
 * Executes a simple query to check whether the database is reachable.
 * Throws an error if the query fails.
 */

// Called: Database connectivity check
// export const connectDB = async () => {
//   await db.execute(sql`SELECT 1`);
// };

// export { db };
neonConfig.webSocketConstructor = ws;

const pool = new Pool({
  connectionString: config.postgres.url,
});

const db = drizzle({ client: pool });

export const connectDB = async () => {
  await db.execute(sql`SELECT 1`);
};

export { db };
