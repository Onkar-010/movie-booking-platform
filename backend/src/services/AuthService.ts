/** @format */

import { AuthRepository } from "../repositories/auth.repository";
import { users } from "../db/schemas/users.schema";
import { PasswordUtility } from "../utilities/password.utility";
import { AppError } from "../utilities/appError.utility";
import { LoginInput, RegisterInput } from "../validators/auth.validator";
export class AuthService {
  private authRepository: AuthRepository<typeof users>;

  constructor() {
    this.authRepository = new AuthRepository(users);
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
    const user = await this.authRepository.findByEmail(data.email);

    if (user.length == 0) {
      throw new AppError("Invalid Credentials", 401);
    }

    const isVerified = await PasswordUtility.verifyPassword(
      data.password,
      user[0]!.password_hash,
    );

    if (!isVerified) {
      throw new AppError("Invalid Credentials", 401);
    }

    try {
    } catch (err: any) {}
  }
}
