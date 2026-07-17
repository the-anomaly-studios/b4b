"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUp,
  CalendarDays,
  Clock3,
  Play,
  Share2,
} from "lucide-react";
import {
  performances,
  schools,
  type Performance,
} from "@/lib/data";
import { dateFormatter, numberFormatter } from "@/lib/utils";

type SortOption = "newest" | "popular";

function PerformanceMeta({ performance }: { performance: Performance }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays aria-hidden="true" size={14} />
        {dateFormatter.format(new Date(performance.recordedAt))}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock3 aria-hidden="true" size={14} />
        {performance.duration}
      </span>
      <span className="inline-flex items-center gap-1.5 text-ink">
        <ArrowUp aria-hidden="true" size={14} />
        {numberFormatter.format(performance.upvoteCount)}
      </span>
    </div>
  );
}

function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const shareData = { title, url: window.location.href };
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex min-h-11 items-center gap-2 border border-ink/25 px-3 text-xs font-bold uppercase tracking-[0.08em] transition-colors hover:border-ink hover:bg-ink hover:text-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-live="polite"
    >
      <Share2 aria-hidden="true" size={16} />
      {copied ? "Link copied" : "Share"}
    </button>
  );
}

export function PerformanceFeed() {
  const [schoolId, setSchoolId] = useState("all");
  const [sort, setSort] = useState<SortOption>("newest");

  const visiblePerformances = useMemo(() => {
    const filtered =
      schoolId === "all"
        ? performances
        : performances.filter((performance) => performance.schoolId === schoolId);

    return [...filtered].sort((a, b) =>
      sort === "popular"
        ? b.upvoteCount - a.upvoteCount
        : b.recordedAt.localeCompare(a.recordedAt),
    );
  }, [schoolId, sort]);

  const [lead, ...rest] = visiblePerformances;

  return (
    <section aria-labelledby="latest-performances">
      <div className="flex flex-col gap-5 border-y border-ink py-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">On the field</p>
          <h2
            id="latest-performances"
            className="font-display text-4xl font-extrabold uppercase tracking-[-0.035em] sm:text-5xl"
          >
            Latest performances
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="grid gap-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-muted">
            School
            <select
              value={schoolId}
              onChange={(event) => setSchoolId(event.target.value)}
              className="min-h-11 min-w-44 border border-ink/30 bg-canvas px-3 text-sm font-semibold normal-case tracking-normal text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <option value="all">All schools</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.abbreviation}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-muted">
            Sort
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="min-h-11 min-w-36 border border-ink/30 bg-canvas px-3 text-sm font-semibold normal-case tracking-normal text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most upvoted</option>
            </select>
          </label>
        </div>
      </div>

      {lead ? (
        <div>
          <article className="grid border-b border-ink md:grid-cols-[minmax(0,1.65fr)_minmax(19rem,0.75fr)]">
            <div className="group relative aspect-[16/10] overflow-hidden bg-ink md:aspect-auto md:min-h-[34rem]">
              <Image
                src={lead.imageUrl}
                alt={lead.imageAlt}
                fill
                priority
                sizes="(min-width: 768px) 65vw, 100vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-[0.65rem] text-canvas/75">
                {lead.imageCredit}
              </div>
            </div>
            <div className="flex flex-col justify-between bg-paper px-5 py-7 sm:px-7 md:py-9">
              <div>
                {(() => {
                  const school = schools.find(
                    (item) => item.id === lead.schoolId,
                  );
                  return school ? (
                    <Link
                      href={`/schools/${school.slug}`}
                      className="text-xs font-extrabold uppercase tracking-[0.12em] text-accent hover:underline"
                    >
                      {school.bandName} · {lead.event}
                    </Link>
                  ) : null;
                })()}
                <h3 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.93] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                  {lead.title}
                </h3>
                <p className="mt-5 max-w-xl text-base leading-7 text-muted">
                  {lead.description}
                </p>
              </div>
              <div className="mt-8">
                <PerformanceMeta performance={lead} />
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center gap-2 bg-accent px-4 text-xs font-extrabold uppercase tracking-[0.08em] text-accent-ink transition-colors hover:bg-ink hover:text-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    aria-label={`Preview unavailable for ${lead.title}`}
                    title="Mux playback will be enabled when the project is connected"
                  >
                    <Play aria-hidden="true" fill="currentColor" size={16} />
                    Preview
                  </button>
                  <ShareButton title={lead.title} />
                </div>
              </div>
            </div>
          </article>

          <div className="divide-y divide-ink/20">
            {rest.map((performance, index) => {
              const school = schools.find(
                (item) => item.id === performance.schoolId,
              );

              return (
                <article
                  key={performance.id}
                  className="grid gap-5 py-6 sm:grid-cols-[2.5rem_11rem_1fr] lg:grid-cols-[3rem_17rem_1fr_auto] lg:items-center"
                >
                  <span className="hidden font-display text-3xl font-bold text-ink/35 sm:block">
                    {String(index + 2).padStart(2, "0")}
                  </span>
                  <div className="relative aspect-[16/10] overflow-hidden bg-paper">
                    <Image
                      src={performance.imageUrl}
                      alt={performance.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 272px, (min-width: 640px) 176px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    {school ? (
                      <Link
                        href={`/schools/${school.slug}`}
                        className="text-[0.7rem] font-extrabold uppercase tracking-[0.1em] text-accent hover:underline"
                      >
                        {school.abbreviation} · {performance.event}
                      </Link>
                    ) : null}
                    <h3 className="mt-2 font-display text-3xl font-extrabold uppercase leading-none tracking-[-0.025em] lg:text-4xl">
                      {performance.title}
                    </h3>
                    <div className="mt-3">
                      <PerformanceMeta performance={performance} />
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <ShareButton title={performance.title} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="border-b border-ink py-16 text-center">
          <p className="font-display text-3xl font-extrabold uppercase">
            No performances match this filter.
          </p>
          <button
            type="button"
            onClick={() => setSchoolId("all")}
            className="mt-5 min-h-11 bg-ink px-5 text-sm font-bold text-canvas hover:bg-accent"
          >
            Show all schools
          </button>
        </div>
      )}
    </section>
  );
}
