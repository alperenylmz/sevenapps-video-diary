import { useMutation } from "@tanstack/react-query";
import { trimVideo } from "expo-trim-video";

export const CLIP_DURATION_SECONDS = 5;

export type TrimClipVariables = {
  sourceUri: string;
  startSeconds: number;
};

export function useTrimClipMutation() {
  return useMutation({
    mutationFn: ({ sourceUri, startSeconds }: TrimClipVariables) =>
      trimVideo({
        uri: sourceUri,
        start: startSeconds,
        end: startSeconds + CLIP_DURATION_SECONDS,
      }),
  });
}