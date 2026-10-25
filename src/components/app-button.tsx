import { ActivityIndicator, Pressable, Text } from "react-native";

type Variant = "primary" | "secondary" | "destructive";

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

const VARIANT_CLASSES: Record<Variant, { container: string; label: string }> = {
  primary: { container: "bg-blue-600", label: "text-white" },
  secondary: {
    container: "bg-neutral-100 dark:bg-neutral-800",
    label: "text-black dark:text-white",
  },
  destructive: {
    container: "bg-red-50 dark:bg-red-950",
    label: "text-red-600 dark:text-red-400",
  },
};

export function AppButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
}: AppButtonProps) {
  const isInactive = disabled || loading;
  const classes = VARIANT_CLASSES[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isInactive}
      className={`items-center rounded-2xl py-4 active:opacity-70 ${classes.container} ${isInactive ? "opacity-50" : ""} ${className}`}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "white" : undefined}
        />
      ) : (
        <Text className={`font-semibold ${classes.label}`}>{label}</Text>
      )}
    </Pressable>
  );
}
