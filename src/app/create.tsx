import { CropStep } from "@/features/create-video/components/crop-step";
import { SelectVideoStep } from "@/features/create-video/components/select-video-step";
import type { CreateStep, SourceVideo } from "@/features/create-video/types";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const STEPS: CreateStep[] = ["select", "crop", "details"];

export default function CreateVideoScreen() {
  const [step, setStep] = useState<CreateStep>("select");
  const [source, setSource] = useState<SourceVideo | null>(null);
  const [startSeconds, setStartSeconds] = useState(0);

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

  return (
    <View className="flex-1 bg-white dark:bg-black">
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
        <View className="flex-1 items-center justify-center gap-4 p-4">
          <Text className="text-black dark:text-white">
            Selected: {startSeconds.toFixed(2)}s –{" "}
            {(startSeconds + 5).toFixed(2)}s
          </Text>
          <Pressable onPress={() => setStep("crop")}>
            <Text className="text-blue-600">Back</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
