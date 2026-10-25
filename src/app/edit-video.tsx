import { VideoDetailsForm } from "@/features/videos/components/video-details-form";
import type { VideoDetails } from "@/features/videos/video-schema";
import { useVideoStore } from "@/features/videos/video-store";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function EditVideoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const video = useVideoStore((state) =>
    state.videos.find((item) => item.id === id),
  );

  const updateVideo = useVideoStore((state) => state.updateVideo);

  if (!video) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <Text className="text-black dark:text-white">Video not found.</Text>
      </View>
    );
  }

  function handleSave(details: VideoDetails) {
    if (!video) return;
    updateVideo(video.id, details);
    router.back();
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <VideoDetailsForm
        initialValues={{ name: video.name, description: video.description }}
        submitLabel="Save changes"
        cancelLabel="Cancel"
        onCancel={() => router.back()}
        onSubmit={handleSave}
      />
    </View>
  );
}
