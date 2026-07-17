import { eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { videos } from "@/db/schema";
import { getMuxClient } from "@/lib/mux";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.MUX_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json(
      { error: "Webhook verification is not configured." },
      { status: 503 },
    );
  }

  const body = await request.text();

  try {
    const event = await getMuxClient().webhooks.unwrap(
      body,
      request.headers,
      secret,
    );
    const database = getDatabase();

    switch (event.type) {
      case "video.asset.created": {
        if (!event.data.passthrough) break;
        await database
          .update(videos)
          .set({
            muxAssetId: event.data.id,
            status: "processing",
            updatedAt: new Date(),
          })
          .where(eq(videos.id, event.data.passthrough));
        break;
      }

      case "video.asset.ready": {
        if (!event.data.passthrough) break;
        const playbackId = event.data.playback_ids?.find(
          (playback) => playback.policy === "public",
        )?.id;

        await database
          .update(videos)
          .set({
            muxAssetId: event.data.id,
            muxPlaybackId: playbackId ?? null,
            thumbnailUrl: playbackId
              ? `https://image.mux.com/${playbackId}/thumbnail.jpg`
              : null,
            status: "ready",
            errorMessage: null,
            updatedAt: new Date(),
          })
          .where(eq(videos.id, event.data.passthrough));
        break;
      }

      case "video.asset.errored": {
        if (!event.data.passthrough) break;
        await database
          .update(videos)
          .set({
            muxAssetId: event.data.id,
            status: "errored",
            errorMessage:
              event.data.errors?.messages?.join(" ") ??
              "Mux could not process this video.",
            updatedAt: new Date(),
          })
          .where(eq(videos.id, event.data.passthrough));
        break;
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Rejected Mux webhook", error);
    return Response.json({ error: "Invalid webhook signature." }, { status: 400 });
  }
}
