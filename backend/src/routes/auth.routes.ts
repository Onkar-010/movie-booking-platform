/** @format */

import express from "express";
export const router = express.Router();

import { AuthController } from "../controllers/AuthController";
import { validateBody } from "../middleware/validator.middleware";
import { registerSchema } from "../validators/auth.validator";

const authController = new AuthController();

router.post("/register", validateBody(registerSchema), authController.register);
