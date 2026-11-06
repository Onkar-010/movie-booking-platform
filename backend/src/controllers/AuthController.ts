/** @format */

import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { LoginInput } from "../validators/auth.validator";
import { config } from "../config/index";
import { AppError } from "../utilities/appError.utility";
import { RefreshTokenService } from "../services/RefreshTokenService";

export class AuthController {
  private authService: AuthService;
  private refreshTokenService: RefreshTokenService;
  private cookieOptions = {
    httpOnly: true,
    secure: config.node_env.env === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };

  constructor() {
    this.authService = new AuthService();
    this.refreshTokenService = new RefreshTokenService();
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

  //Login User
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as LoginInput;
      const result = await this.authService.VerifyUser(data);
      res.cookie("refreshToken", result.refreshToken, this.cookieOptions);
      res.status(200).json({
        message: "Login Successfull",
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      console.log(refreshToken);

      if (!refreshToken) {
        throw new AppError("Refresh token missing", 401);
      }

      await this.authService.Logout(refreshToken);

      res.clearCookie("refreshToken", this.cookieOptions);

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  // Logout From All Devices
  logoutAllDevices = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        throw new AppError("Refresh token missing", 401);
      }

      await this.authService.LogoutAllDevices(refreshToken);

      res.clearCookie("refreshToken", this.cookieOptions);

      return res.status(200).json({
        success: true,
        message: "Logged out from all devices successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        throw new AppError("Refresh token missing", 401);
      }

      const result =
        await this.refreshTokenService.refreshAccessToken(refreshToken);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      res.status(200).json({
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  };
}
