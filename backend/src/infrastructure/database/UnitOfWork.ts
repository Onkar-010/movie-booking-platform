/** @format */

import { db } from "../../config/dbConfig";
import type { DbTransaction } from "../../db/types";

export class UnitOfWork {
  async transaction<T>(
    callback: (tx: DbTransaction) => Promise<T>,
    existingTx?: DbTransaction,
  ): Promise<T> {
    // Reuse an existing transaction.
    if (existingTx) {
      return callback(existingTx);
    }

    // Create a new transaction.
    return db.transaction(async (tx) => {
      return callback(tx);
    });
  }
}
