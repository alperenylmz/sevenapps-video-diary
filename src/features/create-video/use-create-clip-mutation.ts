import { CLIP_DURATION_SECONDS, trimClip } from "@/features/video-trim/trim-clip";
import type { VideoEntry } from "@/features/videos/types";
import { deleteFileAtUri, deleteVideoFile, saveTrimmedVideo } from "@/features/videos/video-storage";
import { useVideoStore } from "@/features/videos/video-store";
import { useMutation } from "@tanstack/react-query";


export type CreateClipVariables={
    sourceUri: string;
    startSeconds: number;
    name: string;
    description: string;
};

export function useCreateClipMutation(){
    const addVideo=useVideoStore((state)=>state.addVideo);

    return useMutation({
        mutationFn: async ({
            sourceUri, startSeconds, name, description,
        }: CreateClipVariables): Promise<VideoEntry> => {
            const trimmed=await trimClip({sourceUri, startSeconds});
            let saved:{id: string,fileName:string} | null = null;
            try {
                saved = saveTrimmedVideo(trimmed.uri);
                const entry: VideoEntry = {
                    id: saved.id,
                    name,
                    description,
                    fileName: saved.fileName,
                    durationSeconds: CLIP_DURATION_SECONDS,
                    createdAt: Date.now(),
                };
                await addVideo(entry);
                return entry;
            } catch (error) {
                try {
                    if (saved) deleteVideoFile(saved.fileName);
                    else deleteFileAtUri(trimmed.uri);
                } catch{
                }
                throw error;
            }
        },
    });
}