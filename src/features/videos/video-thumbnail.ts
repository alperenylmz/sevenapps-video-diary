import { useQuery } from "@tanstack/react-query";
import { createVideoPlayer, type VideoPlayer } from "expo-video";

import { getVideoUri, videoFileExists } from "./video-storage";

const THUMBNAIL_TIME_SECONDS = 1;
const THUMBNAIL_MAX_WIDTH = 640;
const READY_TIMEOUT_MS=10_000;

function waitUntilReady(player: VideoPlayer): Promise<void> {
  return new Promise((resolve, reject) => {
    if (player.status === "readyToPlay") {
      resolve();
      return;
    }
    const timeout = setTimeout(() => {
      subscription.remove();
      reject(new Error("Timed out waiting for the video to load"));
    }, READY_TIMEOUT_MS);
    const subscription = player.addListener(
      "statusChange",
      ({ status, error }) => {
        if (status === "readyToPlay") {
          clearTimeout(timeout);
          subscription.remove();
          resolve();
        } else if (status === "error") {
          clearTimeout(timeout);
          subscription.remove();
          reject(new Error(error?.message ?? "Video failed to load"));
        }
      },
    );
  });
}

async function generateVideoThumbnail(uri: string) {
  const player = createVideoPlayer(uri);
  try {
    await waitUntilReady(player);
    const [thumbnail] = await player.generateThumbnailsAsync(
      THUMBNAIL_TIME_SECONDS,
      { maxWidth: THUMBNAIL_MAX_WIDTH },
    );
    if (!thumbnail) throw new Error("No thumbnail generated");
    return thumbnail;
  } finally {
    player.release();
  }
}

export function useVideoThumbnail(fileName: string) {
  return useQuery({
    queryKey: ["video-thumbnail", fileName],
    queryFn: () => {
      if (!videoFileExists(fileName)) throw new Error("Video file is missing");
      return generateVideoThumbnail(getVideoUri(fileName))
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    structuralSharing: false,
  });
}