import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View
} from "react-native";

import { VideoCard } from "@/features/videos/components/video-card";
import {
  useVideoStore,
  useVideoStoreHydrated,
} from "@/features/videos/video-store";

import { AppButton } from "@/components/app-button";

export default function HomeScreen() {
  const isHydrated = useVideoStoreHydrated();
  const videos = useVideoStore((state) => state.videos);

  if (!isHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-white dark:bg-black"
      data={videos}
      keyExtractor={(video) => video.id}
      renderItem={({ item }) => <VideoCard video={item} />}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="gap-4 p-4"
      ListHeaderComponent={
        <AppButton
          label="Create a clip"
          onPress={() => router.push("/create")}
        />
      }
      ListEmptyComponent={
        <Text className="py-8 text-center text-neutral-500 dark:text-neutral-400">
          No videos yet. Tap &quot;Create a clip&quot; to add one.
        </Text>
      }
    />
  );
}
