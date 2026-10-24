import { CLIP_DURATION_SECONDS } from "@/features/video-trim/use-trim-clip-mutation";
import { useEventListener } from "expo";
import { useVideoPlayer, VideoView, type VideoPlayer } from "expo-video";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import type { SourceVideo } from "../types";

const END_SAFETY_MARGIN_SECONDS = 0.05;
const MIN_THUMB_WIDTH = 24;

type CropStepProps = {
  source: SourceVideo;
  onBack: () => void;
  onNext: (startSeconds: number) => void;
};

function seekPlayer(player: VideoPlayer, seconds: number) {
  player.currentTime = seconds;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = (seconds % 60).toFixed(1).padStart(4, "0");
  return `${minutes}:${rest}`;
}

export function CropStep({ source, onBack, onNext }: CropStepProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const [startSeconds, setStartSeconds] = useState(0);
  const offset = useSharedValue(0);
  const endSeconds = startSeconds + CLIP_DURATION_SECONDS;
  const maxStartSeconds = Math.max(
    0,
    source.durationSeconds - CLIP_DURATION_SECONDS - END_SAFETY_MARGIN_SECONDS,
  );
  const thumbWidth =
    trackWidth > 0
      ? Math.max(
          MIN_THUMB_WIDTH,
          (CLIP_DURATION_SECONDS / source.durationSeconds) * trackWidth,
        )
      : 0;
  const travel = Math.max(0, trackWidth - thumbWidth);
  const player = useVideoPlayer(source.uri, (p) => {
    p.muted = true;
    p.timeUpdateEventInterval = 0.1;
    p.play();
  });

  useEventListener(player, "timeUpdate", ({ currentTime }) => {
    if (currentTime >= endSeconds || currentTime < startSeconds) {
      seekPlayer(player, startSeconds);
    }
  });

  function handleScrub(offsetPx: number) {
    const raw = travel > 0 ? (offsetPx / travel) * maxStartSeconds : 0;
    const seconds = Math.round(raw * 100) / 100;
    setStartSeconds(seconds);
    seekPlayer(player, seconds);
  }

  const pan = Gesture.Pan()
    .minDistance(0)
    .onBegin((event) => {
      const next = clamp(event.x - thumbWidth / 2, 0, travel);
      offset.set(next);
      scheduleOnRN(handleScrub, next);
    })
    .onUpdate((event) => {
      const next = clamp(event.x - thumbWidth / 2, 0, travel);
      offset.set(next);
      scheduleOnRN(handleScrub, next);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.get() }],
  }));

  return (
    <GestureHandlerRootView style={styles.root}>
      <View className="flex-1 gap-4 p-4">
        <VideoView
          player={player}
          nativeControls={false}
          contentFit="contain"
          style={styles.video}
        />
        <View className="items-center gap-1">
          <Text className="text-2xl font-semibold text-black dark:text-white">
            {formatTime(startSeconds)} – {formatTime(endSeconds)}
          </Text>
          <Text className="text-neutral-500 dark:text-neutral-400">
            Source length: {source.durationSeconds.toFixed(1)}s · Clip:{" "}
            {CLIP_DURATION_SECONDS}s
          </Text>
        </View>
        <GestureDetector gesture={pan}>
          <View
            className="h-14 justify-center"
            onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
          >
            <View className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            {trackWidth > 0 && (
              <Animated.View
                style={[styles.thumb, { width: thumbWidth }, thumbStyle]}
              />
            )}
          </View>
        </GestureDetector>
        <View className="mt-auto gap-3">
          <Pressable
            onPress={() => onNext(startSeconds)}
            className="items-center rounded-2xl bg-blue-600 py-4 active:opacity-70"
          >
            <Text className="font-semibold text-white">Next</Text>
          </Pressable>
          <Pressable
            onPress={onBack}
            className="items-center rounded-2xl bg-neutral-100 py-4 active:opacity-70 dark:bg-neutral-800"
          >
            <Text className="font-semibold text-black dark:text-white">
              Choose another video
            </Text>
          </Pressable>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  video: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    backgroundColor: "#000",
  },
  thumb: {
    position: "absolute",
    left: 0,
    height: 44,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#2563eb",
    backgroundColor: "rgba(37, 99, 235, 0.25)",
  },
});
