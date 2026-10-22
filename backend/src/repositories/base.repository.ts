/** @format */

import { db } from "../config/dbConfig";

export class BaseRepository<TTable> {
  protected db = db;
  protected table: TTable;

  constructor(table: TTable) {
    this.table = table;
  }
}
