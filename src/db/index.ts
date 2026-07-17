import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let database: ReturnType<typeof createDatabase> | undefined;

function createDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required to access the database.");
  }

  const client = postgres(connectionString, {
    prepare: false,
    max: 1,
  });

  return drizzle(client, { schema });
}

export function getDatabase() {
  database ??= createDatabase();
  return database;
}
