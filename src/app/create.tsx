import { CropStep } from "@/features/create-video/components/crop-step";
import { SelectVideoStep } from "@/features/create-video/components/select-video-step";
import type { CreateStep, SourceVideo } from "@/features/create-video/types";
import { useCreateClipMutation } from "@/features/create-video/use-create-clip-mutation";
import { VideoDetailsForm } from "@/features/videos/components/video-details-form";
import type { VideoDetails } from "@/features/videos/video-schema";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

const STEPS: CreateStep[] = ["select", "crop", "details"];

export default function CreateVideoScreen() {
  const [step, setStep] = useState<CreateStep>("select");
  const [source, setSource] = useState<SourceVideo | null>(null);
  const [startSeconds, setStartSeconds] = useState(0);
  const createClip = useCreateClipMutation();

  function handleSelected(video: SourceVideo) {
    setSource(video);
    setStep("crop");
  }

  function handleBackToSelect() {
    setSource(null);
    setStep("select");
  }

  function handleCropped(seconds: number) {
    setStartSeconds(seconds);
    setStep("details");
  }

  function handleSubmit(details: VideoDetails) {
    if (!source) return;
    createClip.mutate(
      { sourceUri: source.uri, startSeconds, ...details },
      { onSuccess: () => router.back() },
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ gestureEnabled: !createClip.isPending }} />
      <Text className="pt-4 text-center text-sm font-medium text-neutral-500 dark:text-neutral-400">
        Step {STEPS.indexOf(step) + 1} of {STEPS.length}
      </Text>

      {step === "select" && <SelectVideoStep onSelected={handleSelected} />}
      {step === "crop" && source && (
        <CropStep
          source={source}
          onBack={handleBackToSelect}
          onNext={handleCropped}
        />
      )}
      {step === "details" && (
        <VideoDetailsForm
          submitLabel="Save clip"
          cancelLabel="Back"
          isSubmitting={createClip.isPending}
          errorMessage={createClip.error?.message ?? null}
          onCancel={() => setStep("crop")}
          onSubmit={handleSubmit}
        />
      )}
    </View>
  );
}
