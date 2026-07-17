"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { schools } from "@/lib/data";
import { numberFormatter } from "@/lib/utils";

export function SchoolsDirectory() {
  const [query, setQuery] = useState("");
  const [conference, setConference] = useState("all");

  const conferences = [
    ...new Set(schools.map((school) => school.conference)),
  ].sort();
  const normalizedQuery = query.trim().toLowerCase();

  const visibleSchools = schools.filter((school) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [
        school.name,
        school.abbreviation,
        school.bandName,
        school.location,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
    const matchesConference =
      conference === "all" || school.conference === conference;

    return matchesQuery && matchesConference;
  });

  return (
    <div>
      <div className="grid gap-4 border-y border-ink py-5 md:grid-cols-[1fr_auto] md:items-end">
        <label className="grid max-w-xl gap-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-muted">
          Find a school or band
          <span className="relative block">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={18}
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try “Marching 100”"
              className="min-h-12 w-full border border-ink/30 bg-canvas py-3 pl-10 pr-3 text-base font-medium normal-case tracking-normal text-ink placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
          </span>
        </label>
        <label className="grid gap-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-muted">
          Conference
          <select
            value={conference}
            onChange={(event) => setConference(event.target.value)}
            className="min-h-12 min-w-48 border border-ink/30 bg-canvas px-3 text-sm font-semibold normal-case tracking-normal text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <option value="all">All conferences</option>
            {conferences.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visibleSchools.length > 0 ? (
        <ul className="divide-y divide-ink/20 border-b border-ink">
          {visibleSchools.map((school, index) => (
            <li key={school.id}>
              <Link
                href={`/schools/${school.slug}`}
                className="group grid gap-5 py-7 transition-colors hover:bg-paper focus-visible:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:grid-cols-[4rem_1fr_auto] sm:items-center lg:grid-cols-[4rem_1.35fr_1fr_auto]"
              >
                <span
                  className="grid size-14 place-items-center border border-ink/20 font-display text-xl font-extrabold text-white"
                  style={{ backgroundColor: school.primaryColor }}
                  aria-hidden="true"
                >
                  {school.abbreviation.slice(0, 2)}
                </span>
                <span>
                  <span className="block text-[0.65rem] font-extrabold uppercase tracking-[0.12em] text-accent">
                    {String(index + 1).padStart(2, "0")} · {school.conference}
                  </span>
                  <span className="mt-1 block font-display text-3xl font-extrabold uppercase leading-none tracking-[-0.025em]">
                    {school.name}
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-muted">
                    {school.bandName}
                  </span>
                </span>
                <span className="hidden lg:block">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-muted">
                    <MapPin aria-hidden="true" size={15} />
                    {school.location}
                  </span>
                  <span className="mt-2 block max-w-md text-sm leading-6 text-muted">
                    {school.description}
                  </span>
                </span>
                <span className="flex items-center justify-between gap-5 sm:block sm:text-right">
                  <span>
                    <span className="block font-display text-3xl font-extrabold tabular-nums">
                      {numberFormatter.format(school.totalScore)}
                    </span>
                    <span className="block text-[0.65rem] font-bold uppercase tracking-[0.08em] text-muted">
                      Votes
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="mt-3 inline-block transition-transform group-hover:translate-x-1"
                    size={20}
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-b border-ink py-20 text-center">
          <p className="font-display text-4xl font-extrabold uppercase">
            No band found
          </p>
          <p className="mt-2 text-sm text-muted">
            Try a school name, band name, city, or another conference.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setConference("all");
            }}
            className="mt-6 min-h-11 bg-ink px-5 text-sm font-bold text-canvas hover:bg-accent"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
