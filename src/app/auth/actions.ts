"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type AuthActionState = {
  error?: string;
  success?: string;
};

const credentialsSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const signUpSchema = credentialsSchema.extend({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(40, "Username must be 40 characters or fewer.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores.",
    ),
});

function unavailableState(): AuthActionState | null {
  if (isSupabaseConfigured()) {
    return null;
  }

  return {
    error:
      "Supabase is not configured. Add the public project URL and publishable key to .env.",
  };
}

async function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const requestHeaders = await headers();
  return requestHeaders.get("origin") ?? "http://localhost:3000";
}

export async function signIn(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const unavailable = unavailableState();
  if (unavailable) return unavailable;

  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  const next = formData.get("next");
  redirect(
    typeof next === "string" && next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/account",
  );
}

export async function signUp(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const unavailable = unavailableState();
  if (unavailable) return unavailable;

  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    username: formData.get("username"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details." };
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/account`,
      data: { username: parsed.data.username },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/account");
  }

  return {
    success: "Check your email to confirm your account, then sign in.",
  };
}

export async function signInWithGoogle() {
  if (!isSupabaseConfigured()) {
    redirect("/sign-in?error=Supabase%20is%20not%20configured");
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback?next=/account`,
    },
  });

  if (error) {
    redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
  }

  redirect(data.url);
}

export async function requestPasswordReset(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const unavailable = unavailableState();
  if (unavailable) return unavailable;

  const email = z.email().safeParse(formData.get("email"));
  if (!email.success) {
    return { error: "Enter a valid email address." };
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const { error } = await supabase.auth.resetPasswordForEmail(email.data, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success:
      "If an account exists for that email, a password reset link is on its way.",
  };
}

export async function updatePassword(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const unavailable = unavailableState();
  if (unavailable) return unavailable;

  const password = z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .safeParse(formData.get("password"));
  const confirmation = formData.get("passwordConfirmation");

  if (!password.success) {
    return { error: password.error.issues[0]?.message };
  }

  if (password.data !== confirmation) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: password.data,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Your password has been updated." };
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/");
}
