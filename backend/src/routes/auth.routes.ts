/** @format */

import express from "express";
export const router = express.Router();

import { AuthController } from "../controllers/AuthController";
import { validateBody } from "../middleware/validator.middleware";
import { authenticateAccessToken as authorize } from "../middleware/auth.middleware";
import { registerSchema, loginSchema } from "../validators/auth.validator";

const authController = new AuthController();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/logout-all", authController.logoutAllDevices);
router.post("/refresh", authController.refresh);

//Test
router.get("/test", authorize, (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Authorized",
  });
});
