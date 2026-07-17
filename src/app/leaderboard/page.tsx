import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Trophy } from "lucide-react";
import { LeaderboardList } from "@/components/leaderboard-list";
import { numberFormatter } from "@/lib/utils";
import { schools } from "@/lib/data";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "See which HBCU marching bands are earning the most community support.",
};

export default function LeaderboardPage() {
  const totalVotes = schools.reduce((total, school) => total + school.totalScore, 0);

  return (
    <main id="main-content">
      <section className="bg-ink text-canvas">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_22rem] lg:px-10 lg:py-20">
          <div>
            <p className="mb-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
              <Trophy aria-hidden="true" size={16} />
              Community rankings
            </p>
            <h1 className="max-w-4xl font-display text-[clamp(4.5rem,10vw,9rem)] font-extrabold uppercase leading-[0.78] tracking-[-0.05em]">
              The bands setting the pace
            </h1>
          </div>
          <div className="self-end border-t border-canvas/25 pt-5">
            <p className="font-display text-5xl font-extrabold tabular-nums">
              {numberFormatter.format(totalVotes)}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-canvas/60">
              Verified votes this season
            </p>
            <p className="mt-5 text-sm leading-6 text-canvas/70">
              Rankings update as verified listeners support individual
              performances.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Season standings</p>
            <h2 className="font-display text-5xl font-extrabold uppercase tracking-[-0.035em]">
              All schools
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-muted">
            <ShieldCheck aria-hidden="true" className="text-positive" size={17} />
            Unique account votes only
          </div>
        </div>

        <LeaderboardList showDescription />

        <div className="mt-10 grid gap-6 border-t border-ink pt-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="font-display text-3xl font-extrabold uppercase">
              How is the score calculated?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Every verified upvote on a school&apos;s performance adds one
              point. A listener can support each performance once, and can
              remove that vote at any time.
            </p>
          </div>
          <Link
            href="/about"
            className="inline-flex min-h-11 items-center gap-2 font-bold underline decoration-2 underline-offset-8 hover:text-accent"
          >
            Read the rules
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
