import { router } from "expo-router";
import { Button, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

export default function CreateVideoScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Create video</ThemedText>
      <Button title="Close" onPress={() => router.dismiss()} />
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
