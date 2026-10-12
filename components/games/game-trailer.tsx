"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Film } from "lucide-react";

interface GameTrailerProps {
  title: string;
  youtubeId?: string;
  coverUrl?: string | null;
}

export function GameTrailer({ title, youtubeId, coverUrl }: GameTrailerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Film className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-bold text-foreground">
            العرض الرسمي للتعريب
          </h2>
        </div>
        <span className="rounded-md bg-surface-2 px-2.5 py-0.5 text-xs font-semibold text-muted">
          1080p FHD
        </span>
      </div>

      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {youtubeId ? (
          isPlaying ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={`العرض الرسمي لتعريب ${title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          ) : (
            <div className="group relative h-full w-full cursor-pointer" onClick={() => setIsPlaying(true)}>
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={title}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-85"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-surface to-surface-2" />
              )}
              <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/30" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <button
                  type="button"
                  aria-label="تشغيل العرض الرسمي"
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-500 group-hover:shadow-blue-500/30"
                >
                  <Play className="h-7 w-7 translate-x-0.5 fill-current" />
                </button>
                <span className="rounded-full bg-black/75 px-4 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  اضغط لمشاهدة العرض الرسمي
                </span>
              </div>
            </div>
          )
        ) : (
          <div className="group relative h-full w-full">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={title}
                fill
                sizes="100vw"
                className="object-cover opacity-75 blur-xs"
              />
            ) : null}
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 text-center">
              <Film className="h-12 w-12 text-muted mb-3 opacity-40" />
              <p className="text-sm font-semibold text-foreground/90">
                العرض الرسمي المخصص لهذا التعريب قيد الإنتاج
              </p>
              <p className="mt-1 text-xs text-muted max-w-sm">
                يمكنك معاينة صور وملفات التعريب في الأقسام أدناه أو الانضمام لقناتنا لمشاهدة لقطات اللعب.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
