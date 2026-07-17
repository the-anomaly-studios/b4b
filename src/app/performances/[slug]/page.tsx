import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Trophy } from "lucide-react";
import { MuxVideoPlayer } from "@/components/mux-video-player";
import { createClient } from "@/lib/supabase/server";
import { dateFormatter, numberFormatter } from "@/lib/utils";

type PerformancePageProps = {
  params: Promise<{ slug: string }>;
};

const getPerformance = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("videos")
    .select(
      "id, title, description, mux_playback_id, recorded_at, created_at, upvote_count, status, school:schools(name, band_name, slug)",
    )
    .eq("slug", slug)
    .eq("status", "ready")
    .maybeSingle();

  return data;
});

export async function generateMetadata({
  params,
}: PerformancePageProps): Promise<Metadata> {
  const performance = await getPerformance((await params).slug);

  if (!performance) return { title: "Performance not found" };

  return {
    title: performance.title,
    description:
      performance.description ?? "Watch this HBCU marching-band performance.",
  };
}

export default async function PerformancePage({
  params,
}: PerformancePageProps) {
  const performance = await getPerformance((await params).slug);

  if (!performance?.mux_playback_id) {
    notFound();
  }

  const school = Array.isArray(performance.school)
    ? performance.school[0]
    : performance.school;
  const performanceDate = performance.recorded_at ?? performance.created_at;

  return (
    <main id="main-content">
      <section className="bg-ink text-canvas">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-canvas/65 hover:text-canvas"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            All performances
          </Link>
          <div className="mt-5 overflow-hidden border border-canvas/15 bg-black">
            <MuxVideoPlayer
              playbackId={performance.mux_playback_id}
              title={performance.title}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_16rem] lg:px-10 lg:py-14">
        <div>
          {school ? (
            <Link
              href={`/schools/${school.slug}`}
              className="text-xs font-extrabold uppercase tracking-[0.12em] text-accent hover:underline"
            >
              {school.band_name} · {school.name}
            </Link>
          ) : null}
          <h1 className="mt-3 max-w-4xl font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-[-0.035em] sm:text-6xl">
            {performance.title}
          </h1>
          {performance.description ? (
            <p className="mt-5 max-w-3xl text-base leading-7 text-muted">
              {performance.description}
            </p>
          ) : null}
        </div>
        <aside className="border-t border-ink pt-5 lg:border-l lg:border-t-0 lg:pl-7">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-muted">
            <CalendarDays aria-hidden="true" size={15} />
            {dateFormatter.format(new Date(performanceDate))}
          </p>
          <p className="mt-5 flex items-center gap-2 font-display text-3xl font-extrabold">
            <Trophy aria-hidden="true" className="text-accent" size={20} />
            {numberFormatter.format(performance.upvote_count)}
          </p>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted">
            Community votes
          </p>
        </aside>
      </section>
    </main>
  );
}
