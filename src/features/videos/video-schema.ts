import { z } from "zod";

export const NAME_MAX_LENGTH = 60;
export const DESCRIPTION_MAX_LENGTH = 280;

export const videoDetailsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(NAME_MAX_LENGTH, `Name must be at most ${NAME_MAX_LENGTH} characters`),
  description: z
    .string()
    .trim()
    .max(
      DESCRIPTION_MAX_LENGTH,
      `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters`,
    ),
});

export type VideoDetails = z.infer<typeof videoDetailsSchema>;
export type VideoDetailsErrors = Partial<Record<keyof VideoDetails, string>>;

export type VideoDetailsValidation =
  | { success: true; data: VideoDetails }
  | { success: false; errors: VideoDetailsErrors };

export function validateVideoDetails(input: VideoDetails): VideoDetailsValidation {
  const result = videoDetailsSchema.safeParse(input);
  if (result.success) return { success: true, data: result.data };

  const errors: VideoDetailsErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if ((field === "name" || field === "description") && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return { success: false, errors };
}