/** @format */

import { eq } from "drizzle-orm";
import type { InferInsertModel } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import type { PgTable } from "drizzle-orm/pg-core";

export class AuthRepository<
  TTable extends PgTable,
> extends BaseRepository<TTable> {
  constructor(table: TTable) {
    super(table);
  }

  async createUser(data: InferInsertModel<TTable>) {
    const [user] = await this.db.insert(this.table).values(data).returning();
    return user ?? null;
  }

  async findByEmail(email: string) {
    const table = this.table as any;
    const result = await this.db
      .select()
      .from(table)
      .where(eq(table.email, email));

    return result;
  }

  async updateUser(
    userId: number,
    data: Partial<{ name: string; email: string }>,
  ) {
    const result: any = await this.db
      .update(this.table)
      .set(data)
      .where(eq((this.table as any).id, userId))
      .returning();

    return result[0] ?? null;
  }

  async updatePassword(userId: string, password_hash: string) {
    const result = await this.db
      .update(this.table)
      .set({ password_hash } as any)
      .where(eq((this.table as any).id, userId))
      .returning({ id: (this.table as any).id });

    return result[0] ?? null;
  }

  async deleteUser(id: number) {
    const [deletedUser] = await this.db
      .delete(this.table)
      .where(eq((this.table as any).id, id))
      .returning({ id: (this.table as any).id });

    return deletedUser ?? null;
  }
}
