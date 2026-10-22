/** @format */

import express from "express";
export const router = express.Router();

//Routers
import * as authRoutes from "./auth.routes";

router.use("/auth", authRoutes.router);
