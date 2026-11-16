/** @format */

import { AuthRepository } from "../repositories/auth.repository";
import { users } from "../db/schemas/users.schema";
import { PasswordUtility } from "../utilities/password.utility";
import { AppError } from "../utilities/appError.utility";
import { LoginInput, RegisterInput } from "../validators/auth.validator";
import { JWTUtility } from "../utilities/jwt.utility";
import { RefreshTokenService } from "./RefreshTokenService";
export class AuthService {
  private authRepository: AuthRepository<typeof users>;
  private refreshTokenService: RefreshTokenService;

  constructor() {
    this.authRepository = new AuthRepository(users);
    this.refreshTokenService = new RefreshTokenService();
  }

  //Create
  async CreateUser(data: RegisterInput) {
    const isExisting = await this.authRepository.findByEmail(data.email);

    if (isExisting.length > 0) {
      throw new AppError("Email already registered", 409);
    }

    const password_hash = await PasswordUtility.hashPassword(data.password);

    try {
      return await this.authRepository.createUser({
        name: data.name,
        email: data.email,
        password_hash,
      });
    } catch (err: any) {
      if (err?.code === "23505") {
        throw new AppError("Email already registered", 409);
      }
      throw err;
    }
  }

  //Login
  async VerifyUser(data: LoginInput) {
    //check user exits
    const user = await this.authRepository.findByEmail(data.email);

    if (user.length == 0) {
      throw new AppError("Invalid Credentials", 401);
    }

    //verify Password
    const isVerified = await PasswordUtility.verifyPassword(
      data.password,
      user[0]!.password_hash,
    );

    if (!isVerified) {
      throw new AppError("Invalid Credentials", 401);
    }

    //Create Access Token
    const accessToken = JWTUtility.signAccessToken(user[0]!.id);

    //Create refresh Token
    const { token } = await this.refreshTokenService.createRefreshToken(
      user[0]!.id,
    );

    //Send it To Controller (Controller Will Handle way of Response , cokkie or res.body)
    return {
      user: {
        id: user[0]!.id,
        name: user[0]!.name,
        email: user[0]!.email,
      },
      accessToken,
      refreshToken: token,
    };
  }

  //Logout
  async Logout(refreshToken: string) {
    const result =
      await this.refreshTokenService.revokeRefreshToken(refreshToken);
    return result;
  }

  //logout From All Devices
  async LogoutAllDevices(refreshToken: string) {
    const result =
      await this.refreshTokenService.revokeAllRefreshTokens(refreshToken);
    return result;
  }
}
