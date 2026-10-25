import { create } from "zustand";

import type { VideoEntry } from "./types";
import type { VideoDetails } from "./video-schema";

import { deleteVideoById, getVideosPage, insertVideo, PAGE_SIZE, updateVideoDetails, type VideoCursor } from "./video-repository";

type VideoState = {
  videos: VideoEntry[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  loadInitial: ()=>Promise<void>;
  loadMore: ()=>Promise<void>;
  addVideo: (video: VideoEntry) => Promise<void>;
  removeVideo: (id: string) => Promise<void>;
  updateVideo: (id: string, changes: VideoDetails) => Promise<void>;
};

function toCursor(video: VideoEntry): VideoCursor{
  return {createdAt: video.createdAt, id: video.id};
};

function appendUnique(current: VideoEntry[], page: VideoEntry[]){
  const knownIds=new Set(current.map((video)=>video.id));
  return [...current, ...page.filter((video)=> !knownIds.has(video.id))]
};

function getMessage(error: unknown){
  return error instanceof Error ? error.message : "Could not load videos";
};

let initialLoad: Promise<void> | null = null;

export const useVideoStore = create<VideoState>()((set,get)=> ({
  videos: [],
  hasMore: false,
  isLoading: true,
  isLoadingMore: false,
  error: null,
  loadInitial: () => {
    if (initialLoad) return initialLoad;
    set({ isLoading: true, error: null });
    initialLoad = getVideosPage(null)
      .then((page) =>
        set({
          videos: page,
          hasMore: page.length === PAGE_SIZE,
          isLoading: false,
        }),
      )
      .catch((error) => {
        initialLoad = null; // allow retry
        set({ isLoading: false, error: getMessage(error) });
      });
    return initialLoad;
  },
  loadMore: async () => {
    const { videos, hasMore, isLoading, isLoadingMore } = get();
    if (!hasMore || isLoading || isLoadingMore || videos.length === 0) return;
    set({ isLoadingMore: true });
    try {
      const page = await getVideosPage(toCursor(videos[videos.length - 1]));
      set((state) => ({
        videos: appendUnique(state.videos, page),
        hasMore: page.length === PAGE_SIZE,
        isLoadingMore: false,
      }));
    } catch (error) {
      console.warn("Could not load more videos", error);
      set({ isLoadingMore: false });
    }
  },
  addVideo: async (video) => {
    await insertVideo(video);
    set((state) => ({
      videos: [video, ...state.videos.filter((item) => item.id !== video.id)],
    }));
  },
  updateVideo: async (id, changes) => {
    await updateVideoDetails(id, changes);
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === id ? { ...video, ...changes } : video,
      ),
    }));
  },
  removeVideo: async (id) => {
    await deleteVideoById(id);
    set((state) => ({
      videos: state.videos.filter((video) => video.id !== id),
    }));
  },

}));