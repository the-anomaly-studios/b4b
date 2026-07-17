import { randomUUID } from "node:crypto";
import { z } from "zod";
import { getMuxClient } from "@/lib/mux";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const uploadSchema = z.object({
  title: z.string().trim().min(3).max(180),
  description: z.string().trim().max(3000).optional(),
  schoolId: z.uuid(),
  recordedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 180);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const parsed = uploadSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid upload details." },
      { status: 400 },
    );
  }

  const { data: school } = await supabase
    .from("schools")
    .select("id, has_marching_band")
    .eq("id", parsed.data.schoolId)
    .maybeSingle();

  if (!school?.has_marching_band) {
    return Response.json(
      { error: "Select a school with a verified marching-band program." },
      { status: 400 },
    );
  }

  const id = randomUUID();
  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";

  try {
    const upload = await getMuxClient().video.uploads.create({
      cors_origin: origin,
      timeout: 3600,
      new_asset_settings: {
        passthrough: id,
        playback_policy: ["public"],
        video_quality: "basic",
      },
    });

    const slug = `${slugify(parsed.data.title)}-${id.slice(0, 8)}`;
    const { error } = await supabase.from("videos").insert({
      id,
      title: parsed.data.title,
      slug,
      description: parsed.data.description || null,
      school_id: parsed.data.schoolId,
      uploader_id: user.id,
      mux_upload_id: upload.id,
      status: "waiting_for_upload",
      recorded_at: parsed.data.recordedAt
        ? new Date(`${parsed.data.recordedAt}T12:00:00Z`).toISOString()
        : null,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ id, url: upload.url }, { status: 201 });
  } catch (error) {
    console.error("Unable to create Mux upload", error);
    return Response.json(
      { error: "Unable to prepare the upload. Try again." },
      { status: 500 },
    );
  }
}
