/** @format */

import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;

  postgres: {
    url: string;
  };

  api: {
    prefix: string;
    version: string;
  };

  cors: {
    origin: string;
    credentials: boolean;
  };
}

const port: number = Number(process.env.PORT || 5000);
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";

const url: string = process.env.DATABASE_URL || "Not Found";

export const config: Config = {
  port: port,

  postgres: {
    url,
  },

  api: {
    prefix: "/api",
    version: "v1",
  },

  cors: {
    origin: corsOrigin,
    credentials: corsOrigin !== "*",
  },
};
