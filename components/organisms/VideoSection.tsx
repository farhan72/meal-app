"use client";

import { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { Typography } from "@/components/atoms/Typography";

interface VideoSectionProps {
  youtubeUrl?: string | null;
}

export function VideoSection({ youtubeUrl }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { rootMargin: "0px", threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!youtubeUrl) return null;

  const videoIdMatch = youtubeUrl.match(/(?:(?:v=)|(?:youtu\.be\/))([a-zA-Z0-9_-]{11})/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;

  if (!videoId) return null;

  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <>
      <div id="video-section" ref={sectionRef} className="mt-16 flex flex-col gap-6 scroll-mt-24">
      <Typography variant="h3">Video Tutorial</Typography>
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg bg-black border border-border-soft">
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
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent shadow-2xl transition-transform duration-200 group-hover:scale-110">
              <Play className="h-7 w-7 fill-white text-white translate-x-0.5 cursor-pointer" />
            </div>
          </button>
        )}
      </div>
    </div>

      <a
        href="#video-section"
        className={`group fixed bottom-8 right-8 z-50 flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-white shadow-xl shadow-accent/20 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-accent/90 hover:shadow-2xl hover:shadow-accent/40 active:scale-95 ${
          isIntersecting ? "translate-y-20 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
        }`}
        aria-label="Scroll to video tutorial"
      >
        <div className="relative">
          <Play className="h-5 w-5 fill-white text-white transition-transform group-hover:scale-110" />
          <span className="absolute inset-0 block h-full w-full animate-ping rounded-full bg-white opacity-20"></span>
        </div>
        <span className="font-semibold tracking-wide">See Tutorial</span>
      </a>
    </>
  );
}
