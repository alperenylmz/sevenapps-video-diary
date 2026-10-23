import { useVideoPlayer, VideoView } from "expo-video";
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
  const player = useVideoPlayer(uri, (instance) => {
    instance.loop = loop;
    if (autoPlay) instance.play();
  });

  return (
    <VideoView
      player={player}
      style={[styles.video, style]}
      nativeControls
      contentFit="contain"
    />
  );
}

const styles = StyleSheet.create({
  video: { width: "100%", aspectRatio: 16 / 9, backgroundColor: "#000" },
});
