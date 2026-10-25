import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    DESCRIPTION_MAX_LENGTH,
    NAME_MAX_LENGTH,
    validateVideoDetails,
    type VideoDetails,
} from "../video-schema";

type VideoDetailsFormProps = {
  initialValues?: VideoDetails;
  submitLabel: string;
  cancelLabel: string;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onSubmit: (details: VideoDetails) => void;
  onCancel: () => void;
};

const INPUT_BASE_CLASS =
  "rounded-xl border px-4 py-3 text-[16px] text-black dark:text-white";

function inputClass(hasError: boolean) {
  return `${INPUT_BASE_CLASS} ${
    hasError ? "border-red-500" : "border-neutral-300 dark:border-neutral-700"
  }`;
}

export function VideoDetailsForm({
  initialValues,
  submitLabel,
  cancelLabel,
  isSubmitting = false,
  errorMessage = null,
  onSubmit,
  onCancel,
}: VideoDetailsFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const validation = validateVideoDetails({ name, description });
  const errors = hasSubmitted && !validation.success ? validation.errors : {};

  function handleSubmit() {
    if (isSubmitting) return;
    setHasSubmitted(true);
    if (!validation.success) return;
    onSubmit(validation.data);
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
          editable={!isSubmitting}
          maxLength={NAME_MAX_LENGTH}
          placeholder="e.g. Sunday match"
          placeholderTextColor="#9ca3af"
          returnKeyType="next"
          className={inputClass(Boolean(errors.name))}
        />
        {errors.name && (
          <Text className="text-sm text-red-600 dark:text-red-400">
            {errors.name}
          </Text>
        )}
      </View>

      <View className="gap-2">
        <Text className="font-medium text-black dark:text-white">
          Description
        </Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          editable={!isSubmitting}
          maxLength={DESCRIPTION_MAX_LENGTH}
          placeholder="Optional"
          placeholderTextColor="#9ca3af"
          multiline
          textAlignVertical="top"
          className={`${inputClass(Boolean(errors.description))} min-h-28`}
        />
        <View className="flex-row justify-between">
          <Text className="flex-1 text-sm text-red-600 dark:text-red-400">
            {errors.description}
          </Text>
          <Text className="text-xs text-neutral-500 dark:text-neutral-400">
            {description.length}/{DESCRIPTION_MAX_LENGTH}
          </Text>
        </View>
      </View>

      {errorMessage && (
        <Text className="text-red-600 dark:text-red-400">
          Could not save: {errorMessage}
        </Text>
      )}

      <Pressable
        onPress={handleSubmit}
        disabled={isSubmitting}
        className={`items-center rounded-2xl bg-blue-600 py-4 active:opacity-70 ${isSubmitting ? "opacity-50" : ""}`}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="font-semibold text-white">{submitLabel}</Text>
        )}
      </Pressable>

      <Pressable
        onPress={onCancel}
        disabled={isSubmitting}
        className={`items-center rounded-2xl bg-neutral-100 py-4 active:opacity-70 dark:bg-neutral-800 ${isSubmitting ? "opacity-50" : ""}`}
      >
        <Text className="font-semibold text-black dark:text-white">
          {cancelLabel}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
