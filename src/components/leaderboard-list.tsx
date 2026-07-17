import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUp, Minus } from "lucide-react";
import { schools } from "@/lib/data";
import { cn, numberFormatter } from "@/lib/utils";

type LeaderboardListProps = {
  limit?: number;
  showDescription?: boolean;
};

function Movement({ value }: { value: number }) {
  if (value > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-positive">
        <ArrowUp aria-hidden="true" size={14} />
        {value}
        <span className="sr-only">places up</span>
      </span>
    );
  }

  if (value < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-negative">
        <ArrowDown aria-hidden="true" size={14} />
        {Math.abs(value)}
        <span className="sr-only">places down</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center text-muted">
      <Minus aria-hidden="true" size={14} />
      <span className="sr-only">No movement</span>
    </span>
  );
}

export function LeaderboardList({
  limit,
  showDescription = false,
}: LeaderboardListProps) {
  const rankedSchools = [...schools]
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit);

  return (
    <ol className="border-t border-ink">
      {rankedSchools.map((school, index) => (
        <li key={school.id}>
          <Link
            href={`/schools/${school.slug}`}
            className={cn(
              "group grid min-h-24 grid-cols-[3.25rem_1fr_auto] items-center gap-3 border-b border-ink/25 py-4 transition-colors hover:bg-paper focus-visible:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:grid-cols-[4.5rem_4rem_1fr_auto_auto_auto]",
              showDescription && "md:min-h-32",
            )}
          >
            <span className="font-display text-4xl font-extrabold tabular-nums text-ink/30 sm:text-5xl">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              aria-hidden="true"
              className="hidden size-12 place-items-center border border-ink/20 font-display text-lg font-extrabold text-white sm:grid"
              style={{ backgroundColor: school.primaryColor }}
            >
              {school.abbreviation.slice(0, 2)}
            </span>
            <span className="min-w-0">
              <span className="block font-display text-2xl font-extrabold uppercase leading-none tracking-[-0.02em] sm:text-3xl">
                {school.name}
              </span>
              <span className="mt-1.5 block text-xs font-bold uppercase tracking-[0.08em] text-muted">
                {school.bandName}
              </span>
              {showDescription ? (
                <span className="mt-3 hidden max-w-2xl text-sm leading-6 text-muted md:block">
                  {school.description}
                </span>
              ) : null}
            </span>
            <span className="hidden min-w-16 justify-center text-xs font-bold sm:flex">
              <Movement value={school.movement} />
            </span>
            <span className="text-right">
              <span className="block font-display text-2xl font-extrabold tabular-nums sm:text-3xl">
                {numberFormatter.format(school.totalScore)}
              </span>
              <span className="block text-[0.65rem] font-bold uppercase tracking-[0.08em] text-muted">
                Votes
              </span>
            </span>
            <ArrowRight
              aria-hidden="true"
              className="hidden transition-transform group-hover:translate-x-1 sm:block"
              size={20}
            />
          </Link>
        </li>
      ))}
    </ol>
  );
}
