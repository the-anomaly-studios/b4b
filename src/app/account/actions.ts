"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type ProfileActionState = {
  error?: string;
  success?: string;
};

const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(40, "Username must be 40 characters or fewer.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores.",
    ),
  schoolId: z.union([z.uuid(), z.literal("")]),
});

export async function updateProfile(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parsed = profileSchema.safeParse({
    username: formData.get("username"),
    schoolId: formData.get("schoolId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your profile." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Your session expired. Sign in again." };
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    username: parsed.data.username,
    school_id: parsed.data.schoolId || null,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "That username is already taken." };
    }
    return { error: error.message };
  }

  await supabase.auth.updateUser({
    data: { username: parsed.data.username },
  });

  revalidatePath("/account");
  revalidatePath("/", "layout");
  return { success: "Profile updated." };
}
