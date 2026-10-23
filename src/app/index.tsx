import { Link } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">No videos yet</ThemedText>

      <Link href="/create">
        <ThemedText type="link">Create a clip</ThemedText>
      </Link>
      <Link href={{ pathname: "/video/[id]", params: { id: "demo" } }}>
        <ThemedText type="link">Open sample details</ThemedText>
      </Link>
      <Link href="/trim-poc">
        <ThemedText type="link">Trim PoC</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
  },
});
