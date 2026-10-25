import { useQuery } from "@tanstack/react-query";

import { getVideoById } from "./video-repository";
import { useVideoStore } from "./video-store";

export const videoQueryKey = (id: string) => ["video", id] as const;

export function useVideo(id: string | undefined) {
  const fromStore = useVideoStore((state) =>
    state.videos.find((video) => video.id === id),
  );
  const query = useQuery({
    queryKey: videoQueryKey(id ?? ""),
    queryFn: () => getVideoById(id as string),
    enabled: Boolean(id) && !fromStore,
  });

  return {
    video: fromStore ?? query.data ?? null,
    isLoading: Boolean(id) && !fromStore && query.isPending,
  };
}