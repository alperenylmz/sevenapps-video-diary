import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { VideoEntry } from "./types";

type VideoState = {
  videos: VideoEntry[];
  addVideo: (video: VideoEntry) => void;
  removeVideo: (id: string) => void;
};

export const useVideoStore = create<VideoState>()(
  persist(
    (set) => ({
      videos: [],
      addVideo: (video) =>
        set((state) => ({ videos: [video, ...state.videos] })),
      removeVideo: (id) =>
        set((state) => ({
          videos: state.videos.filter((video) => video.id !== id),
        })),
    }),
    {
      name: "video-diary/videos",
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ videos: state.videos }),
    },
  ),
);
export function useVideoStoreHydrated() {
  return useSyncExternalStore(
    (onChange) => useVideoStore.persist.onFinishHydration(onChange),
    () => useVideoStore.persist.hasHydrated(),
    () => false,
  );
}