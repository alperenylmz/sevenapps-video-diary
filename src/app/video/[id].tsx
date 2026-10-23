import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Button,
    ScrollView,
    StyleSheet,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
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
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (!video) {
    return isDeleting ? (
      <ThemedView style={styles.fill} />
    ) : (
      <ThemedView style={styles.centered}>
        <ThemedText>Video not found.</ThemedText>
      </ThemedView>
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
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
    >
      <Stack.Screen options={{ title: video.name }} />

      {fileExists ? (
        <VideoPlayer uri={getVideoUri(video.fileName)} autoPlay loop />
      ) : (
        <ThemedView type="backgroundElement" style={styles.missing}>
          <ThemedText themeColor="textSecondary">
            The video file is missing from this device.
          </ThemedText>
        </ThemedView>
      )}

      <ThemedText style={styles.name}>{video.name}</ThemedText>
      <ThemedText themeColor="textSecondary">{video.description}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {new Date(video.createdAt).toLocaleDateString()} ·{" "}
        {video.durationSeconds}s
      </ThemedText>

      <Button title="Delete video" color="#d93025" onPress={handleDelete} />
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
