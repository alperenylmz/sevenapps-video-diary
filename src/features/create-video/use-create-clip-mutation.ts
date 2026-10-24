import { CLIP_DURATION_SECONDS, trimClip } from "@/features/video-trim/trim-clip";
import type { VideoEntry } from "@/features/videos/types";
import { deleteFileAtUri, saveTrimmedVideo } from "@/features/videos/video-storage";
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

            try {
                const {id, fileName}=saveTrimmedVideo(trimmed.uri);
                return{id, name, description, fileName, durationSeconds:CLIP_DURATION_SECONDS, createdAt: Date.now()};
            } catch (error) {
                deleteFileAtUri(trimmed.uri);
                throw error;
            }
        },
        onSuccess: (video)=> {
            addVideo(video);
        }
    })
}