import { CropStep } from "@/features/create-video/components/crop-step";
import { SelectVideoStep } from "@/features/create-video/components/select-video-step";
import type { CreateStep, SourceVideo } from "@/features/create-video/types";
import { useState } from "react";
import { Text, View } from "react-native";

const STEPS: CreateStep[] = ["select", "crop", "details"];

export default function CreateVideoScreen() {
  const [step, setStep] = useState<CreateStep>("select");
  const [source, setSource] = useState<SourceVideo | null>(null);

  function handleSelected(video: SourceVideo) {
    setSource(video);
    setStep("crop");
  }

  function handleBackToSelect() {
    setSource(null);
    setStep("select");
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Text className="pt-4 text-center text-sm font-medium text-neutral-500 dark:text-neutral-400">
        Step {STEPS.indexOf(step) + 1} of {STEPS.length}
      </Text>

      {step === "select" && <SelectVideoStep onSelected={handleSelected} />}
      {step === "crop" && source && (
        <CropStep source={source} onBack={handleBackToSelect} />
      )}
    </View>
  );
}
