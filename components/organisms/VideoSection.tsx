"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Typography } from "@/components/atoms/Typography";

interface VideoSectionProps {
  youtubeUrl?: string | null;
}

export function VideoSection({ youtubeUrl }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!youtubeUrl) return null;

  const videoIdMatch = youtubeUrl.match(/(?:(?:v=)|(?:youtu\.be\/))([a-zA-Z0-9_-]{11})/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;

  if (!videoId) return null;

  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="mt-16 flex flex-col gap-6">
      <Typography variant="h3">Video Tutorial</Typography>
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg bg-gray-900 border border-gray-200">
        {isPlaying ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => setIsPlaying(true)}
            className="group absolute inset-0 flex h-full w-full items-center justify-center"
            aria-label="Play video tutorial"
          >
            <img
              src={thumbnailUrl}
              alt="Video thumbnail"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-2xl transition-transform duration-200 group-hover:scale-110">
              <Play className="h-7 w-7 fill-white text-white translate-x-0.5 cursor-pointer" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
