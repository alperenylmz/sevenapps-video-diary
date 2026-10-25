import { getDb } from "@/db/database";

import type { VideoEntry } from "./types";
import type { VideoDetails } from "./video-schema";

export const PAGE_SIZE = 20;

export type VideoCursor = { createdAt: number; id: string };

type VideoRow = {
  id: string;
  name: string;
  description: string;
  file_name: string;
  duration_seconds: number;
  created_at: number;
};

const COLUMNS =
  "id, name, description, file_name, duration_seconds, created_at";

function toEntry(row: VideoRow): VideoEntry {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    fileName: row.file_name,
    durationSeconds: row.duration_seconds,
    createdAt: row.created_at,
  };
}

export async function getVideosPage(
  cursor: VideoCursor | null,
  limit = PAGE_SIZE,
): Promise<VideoEntry[]> {
  const db = await getDb();
  const rows = cursor
    ? await db.getAllAsync<VideoRow>(
        `SELECT ${COLUMNS} FROM videos
         WHERE (created_at, id) < (?, ?)
         ORDER BY created_at DESC, id DESC
         LIMIT ?`,
        [cursor.createdAt, cursor.id, limit],
      )
    : await db.getAllAsync<VideoRow>(
        `SELECT ${COLUMNS} FROM videos
         ORDER BY created_at DESC, id DESC
         LIMIT ?`,
        [limit],
      );
  return rows.map(toEntry);
}

export async function getVideoById(id: string): Promise<VideoEntry | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<VideoRow>(
    `SELECT ${COLUMNS} FROM videos WHERE id = ?`,
    [id],
  );
  return row ? toEntry(row) : null;
} 
export async function insertVideo(video: VideoEntry) {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO videos (${COLUMNS}) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      video.id,
      video.name,
      video.description,
      video.fileName,
      video.durationSeconds,
      video.createdAt,
    ],
  );
}

export async function updateVideoDetails(id: string, details: VideoDetails) {
  const db = await getDb();
  await db.runAsync(
    "UPDATE videos SET name = ?, description = ? WHERE id = ?",
    [details.name, details.description, id],
  );
} 
export async function deleteVideoById(id: string) {
  const db = await getDb();
  await db.runAsync("DELETE FROM videos WHERE id = ?", [id]);
}