/** @format */

import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { config } from "./src/config/index";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schemas/*.ts",
  out: "./drizzle",
  dbCredentials: {
    url: config.postgres.url,
  },
});
