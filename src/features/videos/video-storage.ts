import { Directory, File, Paths } from "expo-file-system";

function getVideosDirectory() {
  return new Directory(Paths.document, "videos");
}
export function saveTrimmedVideo(trimmedUri: string): {
  id: string;
  fileName: string;
} {
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const fileName = `${id}.mp4`;

  const directory = getVideosDirectory();
  directory.create({ idempotent: true, intermediates: true });

  new File(trimmedUri).moveSync(new File(directory, fileName));

  return { id, fileName };
}