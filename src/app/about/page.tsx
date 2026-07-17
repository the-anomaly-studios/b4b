import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "How scoring works",
  description:
    "Learn how Band for Band calculates fair, transparent school rankings.",
};

const rules = [
  "Every verified upvote on a performance adds one point to its school.",
  "Each account can vote for a performance once.",
  "Removing an upvote removes that point from the school total.",
  "School totals are the sum of votes across all published performances.",
];

export default function AboutPage() {
  return (
    <main id="main-content">
      <section className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 lg:px-10 lg:py-20">
        <p className="mb-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
          <ShieldCheck aria-hidden="true" size={16} />
          Transparent by design
        </p>
        <h1 className="max-w-5xl font-display text-[clamp(4rem,10vw,8rem)] font-extrabold uppercase leading-[0.8] tracking-[-0.05em]">
          One performance. One vote. Real support.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">
          The leaderboard is a simple view of community support, not a judgment
          of musicianship. The rule set stays understandable so every listener
          knows what moves a school.
        </p>

        <ol className="mt-14 border-t border-ink">
          {rules.map((rule, index) => (
            <li
              key={rule}
              className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-ink/25 py-7 sm:grid-cols-[5rem_1fr_auto] sm:items-center"
            >
              <span className="font-display text-4xl font-extrabold text-ink/30">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="max-w-2xl text-lg font-semibold leading-7">
                {rule}
              </span>
              <Check
                aria-hidden="true"
                className="hidden text-positive sm:block"
                size={22}
              />
            </li>
          ))}
        </ol>

        <div className="mt-12 bg-paper p-6 sm:p-8">
          <h2 className="font-display text-3xl font-extrabold uppercase">
            What comes next
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Before public voting launches, abuse controls and moderation rules
            will be documented here. Scores in the current foundation are sample
            data for product development.
          </p>
          <Link
            href="/leaderboard"
            className="mt-6 inline-flex min-h-11 items-center gap-2 bg-ink px-5 text-sm font-bold text-canvas hover:bg-accent"
          >
            View the standings
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
