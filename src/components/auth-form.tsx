"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  signIn,
  signInWithGoogle,
  signUp,
  type AuthActionState,
} from "@/app/auth/actions";
import { cn } from "@/lib/utils";

type AuthMode = "sign-in" | "sign-up";

const initialState: AuthActionState = {};

function SubmitButton({ mode }: { mode: AuthMode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-12 w-full bg-ink px-5 text-sm font-extrabold uppercase tracking-[0.08em] text-canvas transition-colors hover:bg-accent disabled:cursor-wait disabled:opacity-60"
    >
      {pending
        ? "Working…"
        : mode === "sign-in"
          ? "Sign in"
          : "Create account"}
    </button>
  );
}

function Feedback({ state }: { state: AuthActionState }) {
  if (!state.error && !state.success) return null;

  return (
    <p
      role={state.error ? "alert" : "status"}
      className={cn(
        "flex gap-2 border px-3 py-3 text-sm leading-5",
        state.error
          ? "border-negative/35 bg-negative/5 text-negative"
          : "border-positive/35 bg-positive/5 text-positive",
      )}
    >
      {state.error ? (
        <AlertCircle aria-hidden="true" className="mt-0.5 shrink-0" size={17} />
      ) : (
        <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0" size={17} />
      )}
      {state.error ?? state.success}
    </p>
  );
}

export function AuthForm({
  next = "/account",
  error,
}: {
  next?: string;
  error?: string;
}) {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [signInState, signInAction] = useActionState(signIn, initialState);
  const [signUpState, signUpAction] = useActionState(signUp, initialState);
  const currentState = mode === "sign-in" ? signInState : signUpState;

  return (
    <div className="w-full max-w-md">
      <div
        className="grid grid-cols-2 border-b border-ink/25"
        role="tablist"
        aria-label="Account access"
      >
        {(["sign-in", "sign-up"] as const).map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={mode === item}
            onClick={() => setMode(item)}
            className={cn(
              "min-h-12 border-b-2 text-xs font-extrabold uppercase tracking-[0.1em]",
              mode === item
                ? "border-accent text-ink"
                : "border-transparent text-muted hover:text-ink",
            )}
          >
            {item === "sign-in" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form action={signInWithGoogle} className="mt-7">
        <button
          type="submit"
          className="flex min-h-12 w-full items-center justify-center gap-3 border border-ink/30 bg-canvas px-5 text-sm font-bold transition-colors hover:border-ink hover:bg-paper"
        >
          <span
            aria-hidden="true"
            className="grid size-5 place-items-center rounded-full bg-ink text-[0.65rem] font-extrabold text-canvas"
          >
            G
          </span>
          Continue with Google
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted">
        <span className="h-px flex-1 bg-ink/20" />
        or use email
        <span className="h-px flex-1 bg-ink/20" />
      </div>

      <form
        action={mode === "sign-in" ? signInAction : signUpAction}
        className="grid gap-4"
      >
        <input type="hidden" name="next" value={next} />
        {mode === "sign-up" ? (
          <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.08em]">
            Username
            <input
              required
              name="username"
              autoComplete="username"
              minLength={3}
              maxLength={40}
              pattern="[a-zA-Z0-9_]+"
              placeholder="bandfan"
              className="min-h-12 border border-ink/30 bg-canvas px-3 text-base font-medium normal-case tracking-normal outline-none placeholder:text-muted/55 focus:border-ink focus:ring-2 focus:ring-accent"
            />
          </label>
        ) : null}
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
        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.08em]">
          Password
          <input
            required
            type="password"
            name="password"
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            minLength={8}
            className="min-h-12 border border-ink/30 bg-canvas px-3 text-base font-medium normal-case tracking-normal outline-none focus:border-ink focus:ring-2 focus:ring-accent"
          />
        </label>

        {mode === "sign-in" ? (
          <Link
            href="/forgot-password"
            className="justify-self-end text-xs font-bold underline decoration-1 underline-offset-4 hover:text-accent"
          >
            Forgot password?
          </Link>
        ) : (
          <p className="text-xs leading-5 text-muted">
            By joining, you agree to represent your school and the community
            with respect.
          </p>
        )}

        {error ? <Feedback state={{ error }} /> : null}
        <Feedback state={currentState} />
        <SubmitButton mode={mode} />
      </form>
    </div>
  );
}
