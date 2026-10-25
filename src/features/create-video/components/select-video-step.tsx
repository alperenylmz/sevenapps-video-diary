import { AppButton } from "@/components/app-button";
import { CLIP_DURATION_SECONDS } from "@/features/video-trim/trim-clip";
import { useState } from "react";
import { Text, View } from "react-native";
import { pickSourceVideo } from "../pick-source-video";
import type { SourceVideo } from "../types";

type SelectVideoStepProps = {
  onSelected: (video: SourceVideo) => void;
};

export function SelectVideoStep({ onSelected }: SelectVideoStepProps) {
  const [isPicking, setIsPicking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePick() {
    setError(null);
    setIsPicking(true);
    try {
      const result = await pickSourceVideo();
      if (result.status === "picked") {
        onSelected(result.video);
      } else if (result.status === "too-short") {
        setError(
          `That video is ${result.durationSeconds.toFixed(1)}s long. Pick one that is at least ${CLIP_DURATION_SECONDS}s.`,
        );
      }
    } catch {
      setError("Failed to pick video. Try again.");
    } finally {
      setIsPicking(false);
    }
  }
  return (
    <View className="flex-1 items-center justify-center gap-4 px-6">
      <Text className="text-center text-2xl font-bold text-black dark:text-white">
        Pick a video
      </Text>
      <Text className="text-center text-base text-neutral-500 dark:text-neutral-400">
        Choose a video from your library. Next, you will select a{" "}
        {CLIP_DURATION_SECONDS}-second moment from it.
      </Text>

      <AppButton
        label="Select a Video"
        onPress={handlePick}
        loading={isPicking}
        className="mt-2 min-w-48 px-6"
      />

      {error && (
        <Text className="text-center text-sm text-red-600">{error}</Text>
      )}
    </View>
  );
}
