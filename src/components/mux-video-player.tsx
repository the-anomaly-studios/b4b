"use client";

import MuxPlayer from "@mux/mux-player-react";

export function MuxVideoPlayer({
  playbackId,
  title,
}: {
  playbackId: string;
  title: string;
}) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      metadata={{ video_title: title }}
      accentColor="oklch(0.58 0.23 28)"
      className="aspect-video w-full"
    />
  );
}
