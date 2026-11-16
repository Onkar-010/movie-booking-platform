/** @format */

import express from "express";
import cors from "cors";
import { config } from "./config/index";
import * as apiRoutes from "./routes/index.routes";

import { errorHandler } from "./middleware/error.middleware";
import { AppError } from "./utilities/appError.utility";
import { validateBody } from "./middleware/validator.middleware";
import { registerSchema } from "./validators/auth.validator";

//create Express Application
export const app = express();

app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(config.api.prefix, apiRoutes.router);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

app.get("/test-error", () => {
  throw new AppError("This is a test error", 418);
});

app.post("/test-validate", validateBody(registerSchema), (req, res) => {
  res.json({ success: true, data: req.body });
});

app.use(errorHandler);
