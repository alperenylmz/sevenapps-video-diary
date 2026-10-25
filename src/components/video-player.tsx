import { useEventListener } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type VideoPlayerProps = {
  uri: string;
  autoPlay?: boolean;
  loop?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function VideoPlayer({
  uri,
  autoPlay = false,
  loop = false,
  style,
}: VideoPlayerProps) {
  const hasAutoPlayed = useRef(false);
  const [isFirstFrameShown, setIsFirstFrameShown] = useState(false);
  const [hasError, setHasError] = useState(false);

  const player = useVideoPlayer(uri, (instance) => {
    instance.loop = loop;
  });

  useEventListener(player, "statusChange", ({ status }) => {
    setHasError(status === "error");
  });

  //ilk frame gelmeden başlamamak için aksi takdirde videoda kayma oluyor
  function handleFirstFrameRender() {
    setIsFirstFrameShown(true);
    if (!autoPlay || hasAutoPlayed.current) return;
    hasAutoPlayed.current = true;
    player.play();
  }

  return (
    <View style={[styles.container, style]}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        nativeControls
        contentFit="contain"
        onFirstFrameRender={handleFirstFrameRender}
      />

      {!isFirstFrameShown && (
        <View
          style={[StyleSheet.absoluteFill, styles.overlay]}
          pointerEvents="none"
        >
          {hasError ? (
            <Text style={styles.overlayText}>Could not play this video</Text>
          ) : (
            <ActivityIndicator color="white" />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    overflow: "hidden",
  },
  overlay: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  overlayText: { color: "white" },
});
