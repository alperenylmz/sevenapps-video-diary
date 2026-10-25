import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Image } from "expo-image";

import type { VideoEntry } from "../types";
import { useVideoThumbnail } from "../video-thumbnail";

type VideoCardProps = { video: VideoEntry };

export function VideoCard({ video }: VideoCardProps) {
  const { data: thumbnail, error } = useVideoThumbnail(video.fileName);
  if (error) console.log("[thumbnail]", video.fileName, error.message);
  return (
    <Link href={{ pathname: "/video/[id]", params: { id: video.id } }} asChild>
      <Pressable className="flex-row items-center gap-4 rounded-2xl bg-neutral-100 p-4 active:opacity-70 dark:bg-neutral-900">
        <View className="aspect-video w-28 overflow-hidden rounded-lg bg-neutral-300 dark:bg-neutral-800">
          {thumbnail && (
            <Image
              source={thumbnail}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={150}
            />
          )}
        </View>
        <View className="flex-1 gap-1">
          <Text
            numberOfLines={1}
            className="font-bold text-black dark:text-white"
          >
            {video.name}
          </Text>
          <Text
            numberOfLines={2}
            className="text-sm text-neutral-500 dark:text-neutral-400"
          >
            {video.description}
          </Text>
          <Text className="text-sm text-neutral-500 dark:text-neutral-400">
            {new Date(video.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
