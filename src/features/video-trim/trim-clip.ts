import { trimVideo } from "expo-trim-video";

export const CLIP_DURATION_SECONDS = 5;

export type TrimClipVariables = {
  sourceUri: string;
  startSeconds: number;
};

export function trimClip({sourceUri, startSeconds}: TrimClipVariables) {
  return trimVideo({
    uri: sourceUri,
    start: startSeconds,
    end: startSeconds+CLIP_DURATION_SECONDS,
  })
}