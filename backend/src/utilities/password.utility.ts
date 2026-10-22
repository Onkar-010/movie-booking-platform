/** @format */

/** @format */

import argon2 from "argon2";

const Argon2_Options = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
} as const;

export class PasswordUtility {
  static async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, Argon2_Options);
  }

  static async verifyPassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    try {
      return await argon2.verify(passwordHash, password);
    } catch {
      return false;
    }
  }

  static needsRehash(passwordHash: string): boolean {
    try {
      return argon2.needsRehash(passwordHash, Argon2_Options);
    } catch {
      return true;
    }
  }
}
