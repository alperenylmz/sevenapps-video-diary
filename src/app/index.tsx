import { Link } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { VideoCard } from "@/features/videos/components/video-card";
import {
  useVideoStore,
  useVideoStoreHydrated,
} from "@/features/videos/video-store";

export default function HomeScreen() {
  const isHydrated = useVideoStoreHydrated();
  const videos = useVideoStore((state) => state.videos);

  if (!isHydrated) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={videos}
        keyExtractor={(video) => video.id}
        renderItem={({ item }) => <VideoCard video={item} />}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <ThemedView style={styles.links}>
            <Link href="/create">
              <ThemedText type="link">Create a clip</ThemedText>
            </Link>
            <Link href="/trim-poc">
              <ThemedText type="link">Trim PoC</ThemedText>
            </Link>
          </ThemedView>
        }
        ListEmptyComponent={
          <ThemedText themeColor="textSecondary">
            No videos yet. Save one from the Trim PoC.
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { padding: Spacing.three, gap: Spacing.three },
  links: { flexDirection: "row", gap: Spacing.three },
});
