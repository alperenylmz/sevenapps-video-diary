import { useQueryClient } from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  View
} from "react-native";

import { AppButton } from "@/components/app-button";
import { VideoPlayer } from "@/components/video-player";
import { useVideo } from "@/features/videos/use-video";
import { videoThumbnailQueryKey } from "@/features/videos/video-thumbnail";
import {
  deleteVideoFile,
  getVideoUri,
  videoFileExists,
} from "@/features/videos/video-storage";
import { useVideoStore } from "@/features/videos/video-store";

export default function VideoDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { video, isLoading } = useVideo(id);
  const removeVideo = useVideoStore((state) => state.removeVideo);
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  if (isDeleting) {
    return <View className="flex-1 bg-white dark:bg-black" />;
  }

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

  const fileExists = videoFileExists(video.fileName);

  const handleDelete = () => {
    Alert.alert("Delete video", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setIsDeleting(true);
          try {
            await removeVideo(video.id);
          } catch {
            setIsDeleting(false);
            Alert.alert("Could not delete the video", "Please try again");
            return;
          }
          router.back();
          try {
            deleteVideoFile(video.fileName);
          } catch (error) {
            console.warn("Orphaned video file could not be deleted", error);
          }
          queryClient.removeQueries({
            queryKey: videoThumbnailQueryKey(video.fileName),
          });
        },
      },
    ]);
  };

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-black"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="gap-4 p-4"
    >
      <Stack.Screen options={{ title: video.name }} />

      <View className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
        {fileExists ? (
          <VideoPlayer uri={getVideoUri(video.fileName)} autoPlay loop />
        ) : (
          <View className="aspect-video items-center justify-center bg-neutral-100 dark:bg-neutral-900">
            <Text className="text-neutral-500 dark:text-neutral-400">
              The video file is missing from this device.
            </Text>
          </View>
        )}
      </View>

      <View className="gap-2">
        <Text className="text-[22px] font-bold text-black dark:text-white">
          {video.name}
        </Text>
        {video.description ? (
          <Text className="text-base text-neutral-600 dark:text-neutral-300">
            {video.description}
          </Text>
        ) : null}
        <Text className="text-sm text-neutral-500 dark:text-neutral-400">
          {new Date(video.createdAt).toLocaleDateString()} ·{" "}
          {video.durationSeconds}s
        </Text>
      </View>

      <View className="gap-3 pt-2">
        <AppButton
          label="Edit details"
          variant="secondary"
          onPress={() =>
            router.push({ pathname: "/edit-video", params: { id: video.id } })
          }
        />
        <AppButton
          label="Delete video"
          variant="destructive"
          onPress={handleDelete}
        />
      </View>
    </ScrollView>
  );
}
