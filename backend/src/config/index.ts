/** @format */

import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;

  postgres: {
    url: string;
  };

  jwt: {
    secret: string;
    expiry: string;
  };

  api: {
    prefix: string;
    version: string;
  };

  cors: {
    origin: string;
    credentials: boolean;
  };

  node_env: {
    env: string;
  };
}

const port: number = Number(process.env.PORT || 5000);
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";

const url: string = process.env.DATABASE_URL || "Not Found";

const secret = process.env.JWT_ACCESS_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET environment variable is required");
}

const expiry: string = process.env.JWT_EXPIRY || "15m";
if (!expiry) {
  throw new Error("JWT_EXPIRY environment variable is required");
}

const env: string = process.env.NODE_ENV || "development";

export const config: Config = {
  port: port,

  postgres: {
    url,
  },

  jwt: {
    secret,
    expiry,
  },

  api: {
    prefix: "/api",
    version: "v1",
  },

  cors: {
    origin: corsOrigin,
    credentials: corsOrigin !== "*",
  },

  node_env: {
    env,
  },
};
