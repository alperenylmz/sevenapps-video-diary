import { CLIP_DURATION_SECONDS } from "@/features/video-trim/trim-clip";
import * as ImagePicker from "expo-image-picker";
import type { SourceVideo } from "./types";

export type PickSourceVideoResult =
  | { status: "canceled" }
  | { status: "too-short"; durationSeconds: number }
  | { status: "picked"; video: SourceVideo };

export async function pickSourceVideo(): Promise<PickSourceVideoResult> {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
    });
    if(result.canceled){
        return {status: "canceled"};
    };

    const asset = result.assets?.[0];
    if (!asset?.duration) {
        throw new Error("Picked video or its duration is unavailable");
    }
    const durationSeconds = asset.duration / 1000;

    if(durationSeconds < CLIP_DURATION_SECONDS){
        return {status: "too-short", durationSeconds};

    }

    return {status: "picked", video: {uri: asset.uri, durationSeconds}};
}
