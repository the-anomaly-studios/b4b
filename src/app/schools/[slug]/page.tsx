import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  MapPin,
  Music2,
  Trophy,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { dateFormatter, numberFormatter } from "@/lib/utils";

type SchoolPageProps = {
  params: Promise<{ slug: string }>;
};

const getSchool = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("schools")
    .select(
      "id, name, abbreviation, band_name, description, location, institution_type, website_url, primary_color, total_score, has_marching_band",
    )
    .eq("slug", slug)
    .maybeSingle();

  return data;
});

export async function generateMetadata({
  params,
}: SchoolPageProps): Promise<Metadata> {
  const school = await getSchool((await params).slug);

  if (!school) return { title: "School not found" };

  return {
    title: school.name,
    description:
      school.description ??
      `Represent ${school.name} and discover its community on Band for Band.`,
  };
}

export default async function SchoolPage({ params }: SchoolPageProps) {
  const slug = (await params).slug;
  const school = await getSchool(slug);

  if (!school) notFound();

  const supabase = await createClient();
  const { data: performances } = await supabase
    .from("videos")
    .select(
      "id, slug, title, description, thumbnail_url, mux_playback_id, recorded_at, created_at, upvote_count",
    )
    .eq("school_id", school.id)
    .eq("status", "ready")
    .order("created_at", { ascending: false });

  const hasBand = school.has_marching_band && Boolean(school.band_name);

  return (
    <main id="main-content">
      <section className="relative overflow-hidden bg-ink text-canvas">
        <div
          className="absolute inset-x-0 top-0 h-2"
          style={{ backgroundColor: school.primary_color ?? "var(--accent)" }}
        />
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-20">
          <Link
            href="/schools"
            className="inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-canvas/65 hover:text-canvas"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            All HBCUs
          </Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_18rem] lg:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
                {hasBand ? "Marching-band program" : "HBCU community"} ·{" "}
                {school.abbreviation ?? school.institution_type ?? "Recognized"}
              </p>
              <h1 className="mt-4 max-w-5xl font-display text-[clamp(4rem,9vw,8.5rem)] font-extrabold uppercase leading-[0.78] tracking-[-0.05em]">
                {school.band_name ?? school.name}
              </h1>
              <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-canvas/65">
                <MapPin aria-hidden="true" size={17} />
                {hasBand ? `${school.name} · ` : ""}
                {school.location ?? "United States"}
              </p>
            </div>
            <div className="border-t border-canvas/25 pt-5">
              <p className="font-display text-5xl font-extrabold tabular-nums">
                {numberFormatter.format(school.total_score)}
              </p>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-canvas/55">
                Total votes
              </p>
              <p className="mt-5 text-sm leading-6 text-canvas/70">
                {school.description ??
                  (hasBand
                    ? `${school.band_name} represents ${school.name} on the field and in the stands.`
                    : `${school.name} is part of the federally recognized HBCU community. Members can represent the school even without an active marching-band program.`)}
              </p>
              {school.website_url ? (
                <a
                  href={school.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold underline decoration-1 underline-offset-4 hover:text-accent"
                >
                  Visit school website
                  <ExternalLink aria-hidden="true" size={15} />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mb-6 flex items-end justify-between gap-5">
          <div>
            <p className="section-kicker">From the community</p>
            <h2 className="font-display text-5xl font-extrabold uppercase tracking-[-0.035em]">
              Performances
            </h2>
          </div>
          <span className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-muted sm:flex">
            <Music2 aria-hidden="true" size={16} />
            {performances?.length ?? 0} posted
          </span>
        </div>

        {performances && performances.length > 0 ? (
          <div className="border-t border-ink">
            {performances.map((performance) => (
              <article
                key={performance.id}
                className="grid gap-6 border-b border-ink/25 py-6 md:grid-cols-[minmax(15rem,28rem)_1fr] md:items-center"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-paper">
                  {performance.thumbnail_url ? (
                    <Image
                      src={performance.thumbnail_url}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 448px, 100vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.11em] text-accent">
                    {dateFormatter.format(
                      new Date(
                        performance.recorded_at ?? performance.created_at,
                      ),
                    )}
                  </p>
                  <h3 className="mt-2 font-display text-4xl font-extrabold uppercase leading-none tracking-[-0.025em] sm:text-5xl">
                    {performance.title}
                  </h3>
                  {performance.description ? (
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
                      {performance.description}
                    </p>
                  ) : null}
                  <div className="mt-5 flex flex-wrap items-center gap-5">
                    <span className="flex items-center gap-2 text-sm font-bold">
                      <Trophy
                        aria-hidden="true"
                        className="text-accent"
                        size={17}
                      />
                      {numberFormatter.format(performance.upvote_count)} votes
                    </span>
                    <Link
                      href={`/performances/${performance.slug}`}
                      className="inline-flex min-h-11 items-center gap-2 font-bold underline decoration-1 underline-offset-4 hover:text-accent"
                    >
                      Watch performance
                      <ArrowRight aria-hidden="true" size={17} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border-y border-ink py-16">
            <p className="font-display text-4xl font-extrabold uppercase">
              Represent {school.name}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
              {hasBand
                ? "No performances have been published yet. Members can be the first to share one."
                : "This school does not have a verified active marching band listed, but members can still claim their affiliation and support the HBCU community."}
            </p>
            {hasBand ? (
              <Link
                href="/upload"
                className="mt-6 inline-flex min-h-11 items-center gap-2 bg-ink px-5 text-sm font-bold text-canvas hover:bg-accent"
              >
                Upload a performance
                <ArrowRight aria-hidden="true" size={17} />
              </Link>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
}
