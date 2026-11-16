/** @format */

import { db } from "../config/dbConfig";
import { DbTransaction } from "../db/types";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { eq } from "drizzle-orm";

type TableWithId = PgTable & { id: PgColumn };

export class BaseRepository<
  TTable extends TableWithId,
  TUpdate extends Partial<InferInsertModel<TTable>> = Partial<
    InferInsertModel<TTable>
  >,
> {
  protected db = db;
  protected table: TTable;

  constructor(table: TTable) {
    this.table = table;
  }

  async create(
    data: InferInsertModel<TTable>,
    tx?: DbTransaction,
  ): Promise<InferSelectModel<TTable> | null> {
    const executor = tx ?? this.db;
    const [row] = await executor.insert(this.table).values(data).returning();
    return (row as InferSelectModel<TTable>) ?? null;
  }

  async findById(
    id: string,
    tx?: DbTransaction,
  ): Promise<InferSelectModel<TTable> | null> {
    const executor = tx ?? this.db;
    const [row] = await executor
      .select()
      .from(this.table as PgTable)
      .where(eq(this.table.id, id))
      .limit(1);
    return (row as InferSelectModel<TTable>) ?? null;
  }

  async updateById(
    id: string,
    data: TUpdate,
    tx?: DbTransaction,
  ): Promise<InferSelectModel<TTable> | null> {
    const executor = tx ?? this.db;
    const row = await executor
      .update(this.table)
      .set(data)
      .where(eq(this.table.id, id))
      .returning();
    return (row as InferSelectModel<TTable>) ?? null;
  }

  async deleteById(
    id: string,
    tx?: DbTransaction,
  ): Promise<{ id: string } | null> {
    const executor = tx ?? this.db;
    const [deleted] = await executor
      .delete(this.table)
      .where(eq(this.table.id, id))
      .returning({ id: this.table.id });
    return (deleted as { id: string }) ?? null;
  }
}
