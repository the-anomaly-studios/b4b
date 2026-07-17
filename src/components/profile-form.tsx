"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  updateProfile,
  type ProfileActionState,
} from "@/app/account/actions";

const initialState: ProfileActionState = {};

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-12 bg-ink px-6 text-sm font-extrabold uppercase tracking-[0.08em] text-canvas hover:bg-accent disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save profile"}
    </button>
  );
}

export function ProfileForm({
  username,
  schoolId,
  schools,
}: {
  username: string;
  schoolId: string | null;
  schools: Array<{ id: string; name: string; bandName: string | null }>;
}) {
  const [state, action] = useActionState(updateProfile, initialState);

  return (
    <form action={action} className="grid gap-5">
      <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.08em]">
        Username
        <input
          required
          name="username"
          defaultValue={username}
          autoComplete="username"
          minLength={3}
          maxLength={40}
          pattern="[a-zA-Z0-9_]+"
          className="min-h-12 border border-ink/30 bg-canvas px-3 text-base font-medium normal-case tracking-normal outline-none focus:border-ink focus:ring-2 focus:ring-accent"
        />
      </label>
      <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.08em]">
        School affiliation
        <select
          name="schoolId"
          defaultValue={schoolId ?? ""}
          className="min-h-12 border border-ink/30 bg-canvas px-3 text-base font-medium normal-case tracking-normal outline-none focus:border-ink focus:ring-2 focus:ring-accent"
        >
          <option value="">No school selected</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name}
              {school.bandName ? ` · ${school.bandName}` : ""}
            </option>
          ))}
        </select>
      </label>
      <p className="text-xs leading-5 text-muted">
        Your affiliation identifies the school you represent. It does not
        change which performances you can support.
      </p>
      {state.error || state.success ? (
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
      ) : null}
      <SaveButton />
    </form>
  );
}
