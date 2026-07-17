"use client";

import MuxUploader from "@mux/mux-uploader-react";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, UploadCloud } from "lucide-react";

type UploadDetails = {
  title: string;
  description: string;
  schoolId: string;
  recordedAt: string;
};

export function VideoUploadForm({
  defaultSchoolId,
  schools,
}: {
  defaultSchoolId?: string | null;
  schools: Array<{ id: string; name: string; bandName: string | null }>;
}) {
  const [details, setDetails] = useState<UploadDetails | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function prepareUpload(formData: FormData) {
    setError(null);
    setDetails({
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      schoolId: String(formData.get("schoolId") ?? ""),
      recordedAt: String(formData.get("recordedAt") ?? ""),
    });
  }

  async function createEndpoint() {
    if (!details) {
      throw new Error("Add the performance details first.");
    }

    const response = await fetch("/api/uploads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });
    const payload = (await response.json()) as {
      id?: string;
      url?: string;
      error?: string;
    };

    if (!response.ok || !payload.url || !payload.id) {
      const message = payload.error ?? "Unable to prepare the upload.";
      setError(message);
      throw new Error(message);
    }

    setVideoId(payload.id);
    return payload.url;
  }

  if (complete) {
    return (
      <div className="border-y border-ink py-10">
        <CheckCircle2 aria-hidden="true" className="text-positive" size={34} />
        <h2 className="mt-5 font-display text-4xl font-extrabold uppercase">
          Upload received
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
          Mux is processing your performance now. It will become playable after
          the verified webhook marks it ready.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/account"
            className="inline-flex min-h-11 items-center bg-ink px-5 text-sm font-bold text-canvas hover:bg-accent"
          >
            View your uploads
          </Link>
          <button
            type="button"
            onClick={() => {
              setDetails(null);
              setVideoId(null);
              setComplete(false);
            }}
            className="min-h-11 border border-ink px-5 text-sm font-bold hover:bg-paper"
          >
            Upload another
          </button>
        </div>
      </div>
    );
  }

  if (details) {
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            setDetails(null);
            setError(null);
          }}
          className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold underline decoration-1 underline-offset-4 hover:text-accent"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Edit details
        </button>
        <div className="border-t border-ink pt-6">
          <p className="section-kicker">Step 2 of 2</p>
          <h2 className="font-display text-4xl font-extrabold uppercase">
            Choose the video file
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {details.title} ·{" "}
            {schools.find((school) => school.id === details.schoolId)?.name ??
              "Selected school"}
          </p>
          <div className="mt-7 border border-ink/25 bg-paper p-4 sm:p-6">
            <MuxUploader
              endpoint={createEndpoint}
              maxFileSize={5_000_000_000}
              pausable
              onUploadStart={() => setError(null)}
              onUploadError={() =>
                setError("The upload failed. Retry or choose another file.")
              }
              onSuccess={() => setComplete(true)}
            />
          </div>
          {videoId ? (
            <p className="mt-3 text-xs text-muted">
              Upload reference: {videoId.slice(0, 8)}
            </p>
          ) : null}
          {error ? (
            <p
              role="alert"
              className="mt-4 border border-negative/35 px-3 py-3 text-sm text-negative"
            >
              {error}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <form action={prepareUpload} className="grid gap-5">
      <div>
        <p className="section-kicker">Step 1 of 2</p>
        <h2 className="font-display text-4xl font-extrabold uppercase">
          Tell us about the performance
        </h2>
      </div>
      <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.08em]">
        Title
        <input
          required
          name="title"
          minLength={3}
          maxLength={180}
          placeholder="What happened on the field?"
          className="min-h-12 border border-ink/30 bg-canvas px-3 text-base font-medium normal-case tracking-normal outline-none placeholder:text-muted/55 focus:border-ink focus:ring-2 focus:ring-accent"
        />
      </label>
      <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.08em]">
        School
        <select
          required
          name="schoolId"
          defaultValue={defaultSchoolId ?? ""}
          className="min-h-12 border border-ink/30 bg-canvas px-3 text-base font-medium normal-case tracking-normal outline-none focus:border-ink focus:ring-2 focus:ring-accent"
        >
          <option value="" disabled>
            Select a school
          </option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name}
              {school.bandName ? ` · ${school.bandName}` : ""}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.08em]">
        Performance date
        <input
          type="date"
          name="recordedAt"
          max={new Date().toISOString().slice(0, 10)}
          className="min-h-12 border border-ink/30 bg-canvas px-3 text-base font-medium normal-case tracking-normal outline-none focus:border-ink focus:ring-2 focus:ring-accent"
        />
      </label>
      <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.08em]">
        Description
        <textarea
          name="description"
          rows={5}
          maxLength={3000}
          placeholder="Add context about the event, arrangement, or moment."
          className="border border-ink/30 bg-canvas px-3 py-3 text-base font-medium normal-case tracking-normal outline-none placeholder:text-muted/55 focus:border-ink focus:ring-2 focus:ring-accent"
        />
      </label>
      <div className="border-t border-ink/20 pt-5">
        <p className="mb-5 flex gap-2 text-xs leading-5 text-muted">
          <UploadCloud aria-hidden="true" className="shrink-0" size={17} />
          Video files can be up to 5 GB. Keep this page open until the upload
          completes.
        </p>
        <button
          type="submit"
          className="min-h-12 bg-ink px-6 text-sm font-extrabold uppercase tracking-[0.08em] text-canvas hover:bg-accent"
        >
          Continue to video
        </button>
      </div>
    </form>
  );
}
