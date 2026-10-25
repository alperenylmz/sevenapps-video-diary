import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";

const DATABASE_NAME = "video-diary.db";
const DATABASE_VERSION = 1;

async function migrate(database: SQLiteDatabase) {
  const row = await database.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  const currentVersion = row?.user_version ?? 0;
  if (currentVersion >= DATABASE_VERSION) return;

  await database.withTransactionAsync(async () => {
    if (currentVersion < 1) {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS videos (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          description TEXT NOT NULL DEFAULT '',
          file_name TEXT NOT NULL,
          duration_seconds REAL NOT NULL,
          created_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_videos_created_at_id
          ON videos (created_at DESC, id DESC);
      `);
    }
    await database.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  });
}

async function initDatabase() {
  const database = await openDatabaseAsync(DATABASE_NAME);
  await database.execAsync("PRAGMA journal_mode = WAL");
  await migrate(database);
  return database;
}

let databasePromise: Promise<SQLiteDatabase> | null = null;

// migration bitmeden çalismiyor
export function getDb() {
  databasePromise ??= initDatabase().catch((error) => {
    databasePromise = null; 
    throw error;
  });
  return databasePromise;
}