import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, Music2, Trophy } from "lucide-react";
import {
  getPerformancesForSchool,
  getSchoolBySlug,
  schools,
} from "@/lib/data";
import { dateFormatter, numberFormatter } from "@/lib/utils";

type SchoolPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return schools.map((school) => ({ slug: school.slug }));
}

export async function generateMetadata({
  params,
}: SchoolPageProps): Promise<Metadata> {
  const school = getSchoolBySlug((await params).slug);

  if (!school) {
    return { title: "School not found" };
  }

  return {
    title: school.name,
    description: `${school.description} Watch performances by ${school.bandName}.`,
  };
}

export default async function SchoolPage({ params }: SchoolPageProps) {
  const school = getSchoolBySlug((await params).slug);

  if (!school) {
    notFound();
  }

  const schoolPerformances = getPerformancesForSchool(school.id);

  return (
    <main id="main-content">
      <section className="relative overflow-hidden bg-ink text-canvas">
        <div
          className="absolute inset-x-0 top-0 h-2"
          style={{ backgroundColor: school.primaryColor }}
        />
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-20">
          <Link
            href="/schools"
            className="inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-canvas/65 hover:text-canvas"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            All schools
          </Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_18rem] lg:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
                {school.conference} · {school.abbreviation}
              </p>
              <h1 className="mt-4 max-w-5xl font-display text-[clamp(4rem,9vw,8.5rem)] font-extrabold uppercase leading-[0.78] tracking-[-0.05em]">
                {school.bandName}
              </h1>
              <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-canvas/65">
                <MapPin aria-hidden="true" size={17} />
                {school.name} · {school.location}
              </p>
            </div>
            <div className="border-t border-canvas/25 pt-5">
              <p className="font-display text-5xl font-extrabold tabular-nums">
                {numberFormatter.format(school.totalScore)}
              </p>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-canvas/55">
                Total votes
              </p>
              <p className="mt-5 text-sm leading-6 text-canvas/70">
                {school.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mb-6 flex items-end justify-between gap-5">
          <div>
            <p className="section-kicker">From the field</p>
            <h2 className="font-display text-5xl font-extrabold uppercase tracking-[-0.035em]">
              Performances
            </h2>
          </div>
          <span className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-muted sm:flex">
            <Music2 aria-hidden="true" size={16} />
            {schoolPerformances.length} posted
          </span>
        </div>

        {schoolPerformances.length > 0 ? (
          <div className="border-t border-ink">
            {schoolPerformances.map((performance) => (
              <article
                key={performance.id}
                className="grid gap-6 border-b border-ink/25 py-6 md:grid-cols-[minmax(15rem,28rem)_1fr] md:items-center"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-paper">
                  <Image
                    src={performance.imageUrl}
                    alt={performance.imageAlt}
                    fill
                    sizes="(min-width: 768px) 448px, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute bottom-3 right-3 bg-ink px-2 py-1 text-xs font-bold text-canvas">
                    {performance.duration}
                  </span>
                </div>
                <div>
                  <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.11em] text-accent">
                    {performance.event} ·{" "}
                    {dateFormatter.format(new Date(performance.recordedAt))}
                  </p>
                  <h3 className="mt-2 font-display text-4xl font-extrabold uppercase leading-none tracking-[-0.025em] sm:text-5xl">
                    {performance.title}
                  </h3>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
                    {performance.description}
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-sm font-bold">
                    <Trophy aria-hidden="true" className="text-accent" size={17} />
                    {numberFormatter.format(performance.upvoteCount)} votes
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border-y border-ink py-16">
            <p className="font-display text-4xl font-extrabold uppercase">
              The first performance starts with you.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
              Uploads open when member accounts launch. Follow this school now
              and be ready when the next show drops.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex min-h-11 items-center gap-2 bg-ink px-5 text-sm font-bold text-canvas hover:bg-accent"
            >
              Browse all performances
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
