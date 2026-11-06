/** @format */

import { refresh_token } from "./schemas/refresh_token.schema";
import { db } from "../config/dbConfig";

export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
