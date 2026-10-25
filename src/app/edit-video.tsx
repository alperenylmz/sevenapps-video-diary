import { VideoDetailsForm } from "@/features/videos/components/video-details-form";
import { useVideo, videoQueryKey } from "@/features/videos/use-video";
import type { VideoDetails } from "@/features/videos/video-schema";
import { useVideoStore } from "@/features/videos/video-store";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";

export default function EditVideoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { video, isLoading } = useVideo(id);

  const updateVideo = useVideoStore((state) => state.updateVideo);
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator />
      </View>
    );
  }

  if (!video) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <Text className="text-black dark:text-white">Video not found.</Text>
      </View>
    );
  }

  async function handleSave(details: VideoDetails) {
    if (!video || isSaving) return;
    setIsSaving(true);
    try {
      await updateVideo(video.id, details);
    } catch {
      setIsSaving(false);
      Alert.alert("Could not save the video", "Please try again");
      return;
    }
    void queryClient.invalidateQueries({ queryKey: videoQueryKey(video.id) });
    router.back();
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <VideoDetailsForm
        initialValues={{ name: video.name, description: video.description }}
        submitLabel="Save changes"
        cancelLabel="Cancel"
        isSubmitting={isSaving}
        onCancel={() => router.back()}
        onSubmit={handleSave}
      />
    </View>
  );
}
