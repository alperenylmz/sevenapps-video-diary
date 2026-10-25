import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { AppButton } from "@/components/app-button";
import { VideoPlayer } from "@/components/video-player";
import { Spacing } from "@/constants/theme";
import {
  deleteVideoFile,
  getVideoUri,
  videoFileExists,
} from "@/features/videos/video-storage";
import {
  useVideoStore,
  useVideoStoreHydrated,
} from "@/features/videos/video-store";

export default function VideoDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isHydrated = useVideoStoreHydrated();
  const video = useVideoStore((state) =>
    state.videos.find((item) => item.id === id),
  );
  const removeVideo = useVideoStore((state) => state.removeVideo);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator />
      </View>
    );
  }

  if (!video) {
    return isDeleting ? (
      <View className="flex-1 bg-white dark:bg-black" />
    ) : (
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
        onPress: () => {
          setIsDeleting(true);
          router.back();
          removeVideo(video.id);
          deleteVideoFile(video.fileName);
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

      {fileExists ? (
        <VideoPlayer uri={getVideoUri(video.fileName)} autoPlay loop />
      ) : (
        <View className="aspect-video items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900">
          <Text className="text-neutral-500 dark:text-neutral-400">
            The video file is missing from this device.
          </Text>
        </View>
      )}

      <Text className="text-[22px] font-bold text-black dark:text-white">
        {video.name}
      </Text>
      {video.description ? (
        <Text className="text-neutral-500 dark:text-neutral-400">
          {video.description}
        </Text>
      ) : null}
      <Text className="text-sm text-neutral-500 dark:text-neutral-400">
        {new Date(video.createdAt).toLocaleDateString()} ·{" "}
        {video.durationSeconds}s
      </Text>

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

const styles = StyleSheet.create({
  fill: { flex: 1 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { padding: Spacing.three, gap: Spacing.three },
  missing: {
    aspectRatio: 16 / 9,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Spacing.three,
  },
  name: { fontSize: 22, fontWeight: "700" },
});
