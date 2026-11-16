/** @format */

import { AuthRepository } from "../repositories/auth.repository";
import { PasswordUtility } from "../utilities/password.utility";
import { AppError } from "../utilities/appError.utility";
import { LoginInput, RegisterInput } from "../validators/auth.validator";
<<<<<<< HEAD
import { JWTUtility } from "../utilities/jwt.utility";
import { RefreshTokenService } from "./RefreshTokenService";

export class AuthService {
  private authRepository: AuthRepository;
  private refreshTokenService: RefreshTokenService;
=======
export class AuthService {
  private authRepository: AuthRepository<typeof users>;
>>>>>>> parent of 157d532 (Basic Authentication Flow)

  // Hashed once at startup. Lets login take the same time
  // whether or not the email exists.
  private static dummyHash: Promise<string> = PasswordUtility.hashPassword(
    "dummy-password-for-timing-only",
  );

  constructor() {
<<<<<<< HEAD
    this.authRepository = new AuthRepository();
    this.refreshTokenService = new RefreshTokenService();
=======
    this.authRepository = new AuthRepository(users);
>>>>>>> parent of 157d532 (Basic Authentication Flow)
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  //Create
  async CreateUser(data: RegisterInput) {
    const email = this.normalizeEmail(data.email);

    const existing = await this.authRepository.findByEmail(email);
    if (existing) {
      throw new AppError("Email already registered", 409);
    }

    const password_hash = await PasswordUtility.hashPassword(data.password);

    try {
      const user = await this.authRepository.create({
        name: data.name,
        email,
        password_hash,
      });

      if (!user) {
        throw new AppError("Failed to create user", 500);
      }

      // Never return password_hash
      return { id: user.id, name: user.name, email: user.email };
    } catch (err: any) {
      if (err?.code === "23505") {
        throw new AppError("Email already registered", 409);
      }
      throw err;
    }
  }

  //Login
  async VerifyUser(data: LoginInput) {
    const user = await this.authRepository.findByEmail(data.email);

<<<<<<< HEAD
    // Always run a hash comparison (timing fix)
    const hashToCheck = user?.password_hash ?? (await AuthService.dummyHash);
=======
    if (user.length == 0) {
      throw new AppError("Invalid Credentials", 401);
    }

>>>>>>> parent of 157d532 (Basic Authentication Flow)
    const isVerified = await PasswordUtility.verifyPassword(
      data.password,
      hashToCheck,
    );

    if (!user || !isVerified) {
      throw new AppError("Invalid Credentials", 401);
    }

<<<<<<< HEAD
    //Create Access Token
    const accessToken = JWTUtility.signAccessToken(user.id);

    //Create refresh Token
    const { token } = await this.refreshTokenService.createRefreshToken(
      user.id,
    );

    //Send it To Controller (Controller Will Handle way of Response , cookie or res.body)
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken: token,
    };
  }

  //Logout
  async Logout(refreshToken: string) {
    return this.refreshTokenService.revokeRefreshToken(refreshToken);
  }

  //logout From All Devices
  async LogoutAllDevices(refreshToken: string) {
    return this.refreshTokenService.revokeAllRefreshTokens(refreshToken);
=======
    try {
    } catch (err: any) {}
>>>>>>> parent of 157d532 (Basic Authentication Flow)
  }
}
