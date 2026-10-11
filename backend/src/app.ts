/** @format */

import express from "express";
import cors from "cors";
import { config } from "./config/index";

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

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});
