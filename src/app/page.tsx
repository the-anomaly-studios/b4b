import Link from "next/link";
import { ArrowRight, Radio, Trophy } from "lucide-react";
import { LeaderboardList } from "@/components/leaderboard-list";
import { PerformanceFeed } from "@/components/performance-feed";

export default function Home() {
  return (
    <main id="main-content">
      <section className="mx-auto max-w-[1440px] px-4 pb-14 pt-10 sm:px-6 lg:px-10 lg:pb-20 lg:pt-16">
        <div className="grid items-end gap-8 border-b border-ink pb-9 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <div className="mb-5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
              <Radio aria-hidden="true" size={16} />
              The sound of the season
            </div>
            <h1 className="max-w-5xl font-display text-[clamp(4.5rem,11vw,10.5rem)] font-extrabold uppercase leading-[0.75] tracking-[-0.055em]">
              Every band.
              <br />
              <span className="text-accent">Every bar.</span>
            </h1>
          </div>
          <div className="border-t border-ink/25 pt-5 lg:border-t-0 lg:pt-0">
            <p className="max-w-md text-lg font-medium leading-7">
              Watch HBCU marching bands command the field, then put your vote
              behind the performance that moved you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="#latest-performances"
                className="inline-flex min-h-12 items-center gap-2 bg-ink px-5 text-sm font-extrabold uppercase tracking-[0.06em] text-canvas transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Watch now
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
              <Link
                href="/leaderboard"
                className="inline-flex min-h-12 items-center gap-2 border border-ink px-5 text-sm font-extrabold uppercase tracking-[0.06em] transition-colors hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Trophy aria-hidden="true" size={17} />
                See rankings
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <PerformanceFeed />

        <section className="mt-24" aria-labelledby="standings-heading">
          <div className="flex flex-col gap-5 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker">The pulse right now</p>
              <h2
                id="standings-heading"
                className="font-display text-5xl font-extrabold uppercase tracking-[-0.04em] sm:text-6xl"
              >
                Top of the standings
              </h2>
            </div>
            <Link
              href="/leaderboard"
              className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-extrabold uppercase tracking-[0.08em] underline decoration-2 underline-offset-8 hover:text-accent sm:self-auto"
            >
              Full leaderboard
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
          <LeaderboardList limit={4} />
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
            Each verified upvote adds one point to a school&apos;s score. One
            account, one vote per performance.
          </p>
        </section>
      </div>
    </main>
  );
}
