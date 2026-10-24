import { CLIP_DURATION_SECONDS } from "@/features/video-trim/use-trim-clip-mutation";
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
    const durationSeconds= (asset.duration ?? 0) / 1000;

    if(durationSeconds < CLIP_DURATION_SECONDS){
        return {status: "too-short", durationSeconds};

    }

    return {status: "picked", video: {uri: asset.uri, durationSeconds}};
}
