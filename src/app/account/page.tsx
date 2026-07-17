import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Clock3,
  Film,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { ProfileForm } from "@/components/profile-form";
import { schools } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Your account",
};

export default async function AccountPage() {
  if (!isSupabaseConfigured()) {
    redirect("/sign-in?error=Supabase%20is%20not%20configured");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/account");
  }

  const [{ data: profile }, { data: recentUploads }] = await Promise.all([
    supabase
      .from("profiles")
      .select("username, avatar_url, school_id")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("videos")
      .select(
        "id, title, slug, status, error_message, created_at, mux_playback_id",
      )
      .eq("uploader_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const fallbackUsername =
    typeof user.user_metadata.username === "string"
      ? user.user_metadata.username
      : user.email?.split("@")[0] ?? "bandfan";
  const username = profile?.username ?? fallbackUsername;
  const affiliatedSchool = schools.find(
    (school) => school.databaseId === profile?.school_id,
  );

  return (
    <main id="main-content">
      <section className="bg-ink text-canvas">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 sm:px-6 md:grid-cols-[auto_1fr_auto] md:items-end lg:px-10 lg:py-16">
          <div className="grid size-24 place-items-center border border-canvas/25 bg-canvas/5 font-display text-4xl font-extrabold uppercase">
            {username.slice(0, 2)}
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
              Member profile
            </p>
            <h1 className="mt-2 font-display text-6xl font-extrabold uppercase leading-none tracking-[-0.04em]">
              {username}
            </h1>
            <p className="mt-3 text-sm text-canvas/60">{user.email}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center gap-2 border border-canvas/30 px-4 text-sm font-bold hover:border-accent hover:text-accent"
            >
              <LogOut aria-hidden="true" size={17} />
              Sign out
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_20rem] lg:px-10 lg:py-16">
        <div>
          <p className="section-kicker">Personal details</p>
          <h2 className="font-display text-4xl font-extrabold uppercase">
            Represent your school
          </h2>
          <div className="mt-7 max-w-2xl border-t border-ink pt-7">
            <ProfileForm
              username={username}
              schoolId={profile?.school_id ?? null}
            />
          </div>
        </div>

        <aside className="border-t border-ink pt-6 lg:border-t-0 lg:border-l lg:pl-8">
          <ShieldCheck aria-hidden="true" className="text-positive" size={24} />
          <h2 className="mt-4 font-display text-2xl font-extrabold uppercase">
            Verified member
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Your Supabase identity protects future votes and uploads from
            duplication or impersonation.
          </p>
          <div className="mt-6 border-y border-ink/20 py-5">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-muted">
              <UserRound aria-hidden="true" size={16} />
              Affiliation
            </p>
            <p className="mt-2 font-semibold">
              {affiliatedSchool?.name ?? "Not selected"}
            </p>
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-5 border-t border-ink pt-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Your contributions</p>
            <h2 className="font-display text-4xl font-extrabold uppercase">
              Performance uploads
            </h2>
          </div>
          <Link
            href="/upload"
            className="inline-flex min-h-11 items-center gap-2 self-start bg-ink px-5 text-sm font-bold text-canvas hover:bg-accent sm:self-auto"
          >
            <Film aria-hidden="true" size={17} />
            Upload a performance
          </Link>
        </div>

        {recentUploads && recentUploads.length > 0 ? (
          <ul className="mt-6 border-t border-ink">
            {recentUploads.map((upload) => (
              <li
                key={upload.id}
                className="grid gap-4 border-b border-ink/20 py-5 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div>
                  <p className="font-display text-2xl font-extrabold uppercase">
                    {upload.title}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-muted">
                    <Clock3 aria-hidden="true" size={14} />
                    {upload.status.replaceAll("_", " ")}
                  </p>
                  {upload.error_message ? (
                    <p className="mt-2 text-sm text-negative">
                      {upload.error_message}
                    </p>
                  ) : null}
                </div>
                {upload.status === "ready" && upload.mux_playback_id ? (
                  <Link
                    href={`/performances/${upload.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-positive hover:underline"
                  >
                    Watch performance
                    <ArrowRight aria-hidden="true" size={17} />
                  </Link>
                ) : (
                  <span className="text-xs font-bold uppercase tracking-[0.08em] text-muted">
                    {upload.status === "errored"
                      ? "Needs attention"
                      : "Mux is processing"}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 border-y border-ink py-10">
            <p className="font-display text-3xl font-extrabold uppercase">
              No uploads yet
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              Share a field show, stands battle, or drumline moment with the
              community.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
