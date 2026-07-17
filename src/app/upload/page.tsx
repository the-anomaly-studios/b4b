import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Film, ShieldCheck } from "lucide-react";
import { VideoUploadForm } from "@/components/video-upload-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Upload a performance",
  description: "Share an HBCU marching-band performance with the community.",
};

export default async function UploadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/upload");
  }

  const [{ data: profile }, { data: schools }] = await Promise.all([
    supabase
      .from("profiles")
      .select("school_id")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("schools")
      .select("id, name, band_name")
      .eq("has_marching_band", true)
      .order("name", { ascending: true }),
  ]);

  return (
    <main id="main-content">
      <section className="bg-ink text-canvas">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
            <Film aria-hidden="true" size={16} />
            Member upload
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(4rem,9vw,8rem)] font-extrabold uppercase leading-[0.8] tracking-[-0.05em]">
            Put the field in motion
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-canvas/65">
            Add the story first, then upload directly to Mux. Your performance
            appears after processing completes.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_19rem] lg:px-10 lg:py-16">
        <div className="max-w-3xl">
          <VideoUploadForm
            defaultSchoolId={profile?.school_id}
            schools={(schools ?? []).map((school) => ({
              id: school.id,
              name: school.name,
              bandName: school.band_name,
            }))}
          />
        </div>
        <aside className="border-t border-ink pt-6 lg:border-l lg:border-t-0 lg:pl-8">
          <ShieldCheck aria-hidden="true" className="text-positive" size={24} />
          <h2 className="mt-4 font-display text-2xl font-extrabold uppercase">
            Before you upload
          </h2>
          <ul className="mt-4 grid gap-3 text-sm leading-6 text-muted">
            <li>Upload only performances you have permission to share.</li>
            <li>Use a clear title and identify the correct school.</li>
            <li>Do not close the page while the file is transferring.</li>
            <li>Processing time depends on video length and resolution.</li>
          </ul>
        </aside>
      </section>
    </main>
  );
}
