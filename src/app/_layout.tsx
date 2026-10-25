import "@/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  DarkTheme,
  DefaultTheme,
  router,
  Stack,
  ThemeProvider,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Pressable, Text, useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Video Diary",
              headerRight: () => (
                <Pressable
                  onPress={() => router.push("/create")}
                  accessibilityRole="button"
                  accessibilityLabel="Create a clip"
                  hitSlop={8}
                  className="size-[36px] items-center justify-center rounded-full bg-blue-600 active:opacity-70"
                >
                  <Text className="text-[30px] font-medium leading-[32px] text-white">
                    +
                  </Text>
                </Pressable>
              ),
            }}
          />
          <Stack.Screen name="video/[id]" options={{ title: "Video" }} />
          <Stack.Screen
            name="create"
            options={{ title: "New Clip", presentation: "modal" }}
          />
          <Stack.Screen
            name="edit-video"
            options={{ title: "Edit Details", presentation: "modal" }}
          />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
