import { useVideoPlayer, VideoView } from "expo-video";
import { useRef } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

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

  const player = useVideoPlayer(uri, (instance) => {
    instance.loop = loop;
  });

  //ilk frame gelmeden başlamamak için aksi takdirde videoda kayma oluyor
  function handleFirstFrameRender() {
    if (!autoPlay || hasAutoPlayed.current) return;
    hasAutoPlayed.current = true;
    player.play();
  }

  return (
    <VideoView
      player={player}
      style={[styles.video, style]}
      nativeControls
      contentFit="contain"
      onFirstFrameRender={handleFirstFrameRender}
    />
  );
}

const styles = StyleSheet.create({
  video: { width: "100%", aspectRatio: 16 / 9, backgroundColor: "#000" },
});
