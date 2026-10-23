import { Link } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

import type { VideoEntry } from "../types";

type VideoCardProps = { video: VideoEntry };

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={{ pathname: "/video/[id]", params: { id: video.id } }} asChild>
      <Pressable style={({ pressed }) => pressed && styles.pressed}>
        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText style={styles.name} numberOfLines={1}>
            {video.name}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
            {video.description}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {new Date(video.createdAt).toLocaleDateString()}
          </ThemedText>
        </ThemedView>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
  name: { fontWeight: "700" },
  pressed: { opacity: 0.7 },
});
