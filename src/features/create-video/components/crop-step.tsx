import { VideoPlayer } from "@/components/video-player";
import { Pressable, Text, View } from "react-native";
import type { SourceVideo } from "../types";

type CropStepProps = {
  source: SourceVideo;
  onBack: () => void;
};

export function CropStep({ source, onBack }: CropStepProps) {
  return (
    <View className="flex-1 gap-4 p-4">
      <VideoPlayer uri={source.uri} />
      <Text className="text-neutral-500 dark:text-neutral-400">
        Source Length: {source.durationSeconds.toFixed(1)}s
      </Text>
      <Pressable
        onPress={onBack}
        className="items-center rounded-2xl bg-neutral-100 py-4 active:opacity-70 dark:bg-neutral-800"
      >
        <Text className="font-semibold text-black dark:text-white">
          Choose another video
        </Text>
      </Pressable>
    </View>
  );
}
