/** @format */

import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  //Register user
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.CreateUser(req.body);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
