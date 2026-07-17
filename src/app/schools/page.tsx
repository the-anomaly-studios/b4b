import type { Metadata } from "next";
import { School } from "lucide-react";
import { SchoolsDirectory } from "@/components/schools-directory";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Schools",
  description:
    "Browse HBCU marching bands, learn their stories, and watch their latest performances.",
};

export default async function SchoolsPage() {
  const supabase = await createClient();
  const { data: schools } = await supabase
    .from("schools")
    .select(
      "id, slug, name, abbreviation, band_name, location, description, primary_color, total_score, state, has_marching_band, institution_type",
    )
    .order("name", { ascending: true });

  return (
    <main id="main-content">
      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-20">
        <div className="grid gap-8 pb-10 lg:grid-cols-[1fr_25rem] lg:items-end">
          <div>
            <p className="mb-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
              <School aria-hidden="true" size={16} />
              HBCU directory
            </p>
            <h1 className="max-w-4xl font-display text-[clamp(4.5rem,10vw,9rem)] font-extrabold uppercase leading-[0.78] tracking-[-0.05em]">
              Find your sound
            </h1>
          </div>
          <p className="max-w-md border-t border-ink/25 pt-5 text-lg font-medium leading-7">
            Find every federally recognized HBCU, represent your school, and
            discover the marching-band programs carrying the culture forward.
          </p>
        </div>

        <SchoolsDirectory
          schools={(schools ?? []).map((school) => ({
            id: school.id,
            slug: school.slug,
            name: school.name,
            abbreviation: school.abbreviation,
            bandName: school.band_name,
            location: school.location,
            description: school.description,
            primaryColor: school.primary_color,
            totalScore: school.total_score,
            state: school.state,
            hasMarchingBand: school.has_marching_band,
            institutionType: school.institution_type,
          }))}
        />
      </section>
    </main>
  );
}
