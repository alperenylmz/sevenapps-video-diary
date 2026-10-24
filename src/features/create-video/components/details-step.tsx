import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export type ClipDetails = { name: string; description: string };

type DetailsStepProps = {
  isSaving: boolean;
  errorMessage: string | null;
  onBack: () => void;
  onSubmit: (details: ClipDetails) => void;
};

const NAME_MAX_LENGTH = 60;
const DESCRIPTION_MAX_LENGTH = 280;

const INPUT_CLASS =
  "rounded-xl border border-neutral-300 px-4 py-3 text-[16px] text-black dark:border-neutral-700 dark:text-white";

export function DetailsStep({
  isSaving,
  errorMessage,
  onBack,
  onSubmit,
}: DetailsStepProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const canSubmit = name.trim().length > 0 && !isSaving;

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit({ name: name.trim(), description: description.trim() });
  }

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="gap-4 p-4"
    >
      <View className="gap-2">
        <Text className="font-medium text-black dark:text-white">Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          editable={!isSaving}
          maxLength={NAME_MAX_LENGTH}
          placeholder="e.g. Sunday match"
          placeholderTextColor="#9ca3af"
          returnKeyType="next"
          className={INPUT_CLASS}
        />
      </View>

      <View className="gap-2">
        <Text className="font-medium text-black dark:text-white">
          Description
        </Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          editable={!isSaving}
          maxLength={DESCRIPTION_MAX_LENGTH}
          placeholder="Optional"
          placeholderTextColor="#9ca3af"
          multiline
          textAlignVertical="top"
          className={`${INPUT_CLASS} min-h-28`}
        />
        <Text className="self-end text-xs text-neutral-500 dark:text-neutral-400">
          {description.length}/{DESCRIPTION_MAX_LENGTH}
        </Text>
      </View>

      {errorMessage && (
        <Text className="text-red-600 dark:text-red-400">
          Could not save the clip: {errorMessage}
        </Text>
      )}

      <Pressable
        onPress={handleSubmit}
        disabled={!canSubmit}
        className={`items-center rounded-2xl bg-blue-600 py-4 active:opacity-70 ${canSubmit ? "" : "opacity-50"}`}
      >
        {isSaving ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="font-semibold text-white">Save clip</Text>
        )}
      </Pressable>

      <Pressable
        onPress={onBack}
        disabled={isSaving}
        className={`items-center rounded-2xl bg-neutral-100 py-4 active:opacity-70 dark:bg-neutral-800 ${isSaving ? "opacity-50" : ""}`}
      >
        <Text className="font-semibold text-black dark:text-white">Back</Text>
      </Pressable>
    </ScrollView>
  );
}
