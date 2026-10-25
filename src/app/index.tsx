import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { VideoCard } from "@/features/videos/components/video-card";
import { useVideoStore } from "@/features/videos/video-store";

import { AppButton } from "@/components/app-button";

import { useEffect } from "react";
import Animated, {
  FadeInDown,
  LinearTransition,
} from "react-native-reanimated";

const MAX_STAGGERED_ITEMS = 6;

export default function HomeScreen() {
  const videos = useVideoStore((state) => state.videos);
  const isLoading = useVideoStore((state) => state.isLoading);
  const isLoadingMore = useVideoStore((state) => state.isLoadingMore);
  const error = useVideoStore((state) => state.error);
  const loadInitial = useVideoStore((state) => state.loadInitial);
  const loadMore = useVideoStore((state) => state.loadMore);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator />
      </View>
    );
  }

  if (error && videos.length === 0) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-white p-6 dark:bg-black">
        <Text className="text-center text-neutral-500 dark:text-neutral-400">
          {error}
        </Text>
        <View className="w-full">
          <AppButton label="Try again" onPress={() => void loadInitial()} />
        </View>
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-white dark:bg-black"
      data={videos}
      keyExtractor={(video) => video.id}
      renderItem={({ item, index }) => (
        <Animated.View
          entering={
            index < MAX_STAGGERED_ITEMS
              ? FadeInDown.delay(index * 60).duration(300)
              : undefined
          }
          layout={LinearTransition}
        >
          <VideoCard video={item} />
        </Animated.View>
      )}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="gap-4 p-4"
      onEndReached={() => void loadMore()}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        <View className="items-center gap-2 px-6 py-16">
          <Text className="text-lg font-semibold text-black dark:text-white">
            No clips yet
          </Text>
          <Text className="text-center text-neutral-500 dark:text-neutral-400">
            Tap + to create your first 5-second clip.
          </Text>
        </View>
      }
      ListFooterComponent={
        isLoadingMore ? <ActivityIndicator className="py-4" /> : null
      }
    />
  );
}
