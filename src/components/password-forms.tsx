"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  requestPasswordReset,
  updatePassword,
  type AuthActionState,
} from "@/app/auth/actions";

const initialState: AuthActionState = {};

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-12 bg-ink px-5 text-sm font-extrabold uppercase tracking-[0.08em] text-canvas hover:bg-accent disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Working…" : children}
    </button>
  );
}

function Feedback({ state }: { state: AuthActionState }) {
  if (!state.error && !state.success) return null;

  return (
    <p
      role={state.error ? "alert" : "status"}
      className={`border px-3 py-3 text-sm ${
        state.error
          ? "border-negative/35 text-negative"
          : "border-positive/35 text-positive"
      }`}
    >
      {state.error ?? state.success}
    </p>
  );
}

export function PasswordResetRequestForm() {
  const [state, action] = useActionState(requestPasswordReset, initialState);

  return (
    <form action={action} className="mt-8 grid gap-4">
      <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.08em]">
        Email
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="min-h-12 border border-ink/30 bg-canvas px-3 text-base font-medium normal-case tracking-normal outline-none placeholder:text-muted/55 focus:border-ink focus:ring-2 focus:ring-accent"
        />
      </label>
      <Feedback state={state} />
      <SubmitButton>Send reset link</SubmitButton>
    </form>
  );
}

export function UpdatePasswordForm() {
  const [state, action] = useActionState(updatePassword, initialState);

  return (
    <form action={action} className="mt-8 grid gap-4">
      <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.08em]">
        New password
        <input
          required
          type="password"
          name="password"
          autoComplete="new-password"
          minLength={8}
          className="min-h-12 border border-ink/30 bg-canvas px-3 text-base font-medium normal-case tracking-normal outline-none focus:border-ink focus:ring-2 focus:ring-accent"
        />
      </label>
      <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.08em]">
        Confirm password
        <input
          required
          type="password"
          name="passwordConfirmation"
          autoComplete="new-password"
          minLength={8}
          className="min-h-12 border border-ink/30 bg-canvas px-3 text-base font-medium normal-case tracking-normal outline-none focus:border-ink focus:ring-2 focus:ring-accent"
        />
      </label>
      <Feedback state={state} />
      <SubmitButton>Update password</SubmitButton>
    </form>
  );
}
