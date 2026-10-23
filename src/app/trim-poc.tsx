import { useEventListener } from "expo";
import * as ImagePicker from "expo-image-picker";
import { useVideoPlayer, VideoView } from "expo-video";
import { useState } from "react";
import {
    ActivityIndicator,
    Button,
    ScrollView,
    StyleSheet,
    TextInput,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import {
    CLIP_DURATION_SECONDS,
    useTrimClipMutation,
} from "@/features/video-trim/use-trim-clip-mutation";
import { saveTrimmedVideo } from "@/features/videos/video-storage";
import { useTheme } from "@/hooks/use-theme";
import { router } from "expo-router";

import { useVideoStore } from "@/features/videos/video-store";

type PickedVideo = { uri: string; durationSeconds: number };

export default function TrimPocScreen() {
  const theme = useTheme();
  const trim = useTrimClipMutation();
  const addVideo = useVideoStore((state) => state.addVideo);
  const videoCount = useVideoStore((state) => state.videos.length);

  const [picked, setPicked] = useState<PickedVideo | null>(null);
  const [startInput, setStartInput] = useState("0");
  const [pickError, setPickError] = useState<string | null>(null);

  const startSeconds = Number(startInput.replace(",", "."));
  const maxStart = picked ? picked.durationSeconds - CLIP_DURATION_SECONDS : 0;
  const isStartValid =
    picked !== null &&
    Number.isFinite(startSeconds) &&
    startSeconds >= 0 &&
    startSeconds <= maxStart;

  async function pickVideo() {
    setPickError(null);
    trim.reset();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    const durationSeconds = (asset.duration ?? 0) / 1000;
    console.log("[trim-poc] picked", {
      uri: asset.uri,
      durationSeconds,
      width: asset.width,
      height: asset.height,
    });

    if (durationSeconds < CLIP_DURATION_SECONDS) {
      setPicked(null);
      setPickError(
        `Video must be at least ${CLIP_DURATION_SECONDS}s (got ${durationSeconds.toFixed(2)}s).`,
      );
      return;
    }

    setPicked({ uri: asset.uri, durationSeconds });
    setStartInput("0");
  }

  function handleTrim() {
    if (!picked || !isStartValid) return;

    const startedAt = Date.now();
    trim.mutate(
      { sourceUri: picked.uri, startSeconds },
      {
        onSuccess: (data) =>
          console.log("[trim-poc] trimmed", {
            uri: data.uri,
            ms: Date.now() - startedAt,
          }),
        onError: (error) => console.log("[trim-poc] trim failed", error),
      },
    );
  }

  function handleSave() {
    const trimmedUri = trim.data?.uri;
    if (!trimmedUri) return;
    trim.reset();

    const { id, fileName } = saveTrimmedVideo(trimmedUri);
    addVideo({
      id,
      name: `Clip ${videoCount + 1}`,
      description: "Saved from the trim PoC",
      fileName,
      durationSeconds: CLIP_DURATION_SECONDS,
      createdAt: Date.now(),
    });
    router.back();
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
    >
      <Button title="Pick video" onPress={pickVideo} />
      {pickError && <ThemedText>{pickError}</ThemedText>}

      {picked && (
        <>
          <ThemedText type="small">
            Source: {picked.durationSeconds.toFixed(2)}s. Valid start: 0 to{" "}
            {maxStart.toFixed(2)}s
          </ThemedText>
          <TextInput
            value={startInput}
            onChangeText={setStartInput}
            keyboardType="decimal-pad"
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.textSecondary },
            ]}
          />
          <Button
            title={
              trim.isPending
                ? "Trimming..."
                : `Trim ${CLIP_DURATION_SECONDS}s clip`
            }
            disabled={!isStartValid || trim.isPending}
            onPress={handleTrim}
          />
        </>
      )}

      {trim.isPending && <ActivityIndicator />}
      {trim.isError && (
        <ThemedText>Trim failed: {trim.error.message}</ThemedText>
      )}
      {trim.data && (
        <>
          <ThemedText type="code" selectable>
            {trim.data.uri}
          </ThemedText>
          <ResultPreview uri={trim.data.uri} />
          <Button title="Save to diary" onPress={handleSave} />
        </>
      )}
    </ScrollView>
  );
}

function ResultPreview({ uri }: { uri: string }) {
  const [duration, setDuration] = useState<number | null>(null);
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.play();
  });

  useEventListener(player, "statusChange", ({ status }) => {
    if (status === "readyToPlay") setDuration(player.duration);
  });

  return (
    <>
      <ThemedText>Output duration: {duration?.toFixed(3) ?? "..."}s</ThemedText>
      <VideoView
        player={player}
        style={styles.video}
        nativeControls
        contentFit="contain"
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
  video: { width: "100%", aspectRatio: 16 / 9, backgroundColor: "#000" },
});
