import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

import { Image } from "expo-image";

import type { VideoEntry } from "../types";
import { useVideoThumbnail } from "../video-thumbnail";

type VideoCardProps = { video: VideoEntry };

export function VideoCard({ video }: VideoCardProps) {
  const { data: thumbnail, error } = useVideoThumbnail(video.fileName);
  if (error) console.log("[thumbnail]", video.fileName, error.message);
  return (
    <Link href={{ pathname: "/video/[id]", params: { id: video.id } }} asChild>
      <Pressable style={({ pressed }) => pressed && styles.pressed}>
        <ThemedView type="backgroundElement" style={styles.card}>
          <View style={styles.thumbnail}>
            {thumbnail && (
              <Image
                source={thumbnail}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                transition={150}
              />
            )}
          </View>
          <View style={styles.texts}>
            <ThemedText style={styles.name} numberOfLines={1}>
              {video.name}
            </ThemedText>
            <ThemedText
              type="small"
              themeColor="textSecondary"
              numberOfLines={2}
            >
              {video.description}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {new Date(video.createdAt).toLocaleDateString()}
            </ThemedText>
          </View>
        </ThemedView>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.three,
  },
  thumbnail: {
    width: 112,
    aspectRatio: 16 / 9,
    borderRadius: Spacing.two,
    overflow: "hidden",
    backgroundColor: "rgba(128, 128, 128, 0.25)",
  },
  texts: { flex: 1, gap: Spacing.one },
  name: { fontWeight: "700" },
  pressed: { opacity: 0.7 },
});
