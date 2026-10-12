"use client";

import { useState } from "react";
import Image from "next/image";
import { Images, X, ChevronRight, ChevronLeft } from "lucide-react";

interface GameScreenshotsProps {
  title: string;
  screenshots: string[];
}

export function GameScreenshots({ title, screenshots }: GameScreenshotsProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Images className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            صور من التعريب
          </h2>
        </div>
        <span className="text-xs text-muted font-medium">
          {screenshots.length} {screenshots.length === 1 ? "صورة" : "صور"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {screenshots.map((src, i) => (
          <div
            key={i}
            onClick={() => setActiveIdx(i)}
            className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl border border-border bg-surface-2 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-black/10"
          >
            <Image
              src={src}
              alt={`صورة من تعريب ${title} ${i + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            <div className="absolute bottom-2 start-2 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
              تكبير الصورة
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setActiveIdx(null)}
        >
          <button
            type="button"
            onClick={() => setActiveIdx(null)}
            className="absolute top-4 end-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="إغلاق المعاينة"
          >
            <X className="h-6 w-6" />
          </button>

          {screenshots.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev! > 0 ? prev! - 1 : screenshots.length - 1));
                }}
                className="absolute start-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="الصورة السابقة"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev! < screenshots.length - 1 ? prev! + 1 : 0));
                }}
                className="absolute end-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="الصورة التالية"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={screenshots[activeIdx]}
              alt={`معاينة تعريب ${title}`}
              width={1600}
              height={900}
              className="max-h-[85vh] w-auto rounded-xl object-contain shadow-2xl"
              priority
            />
          </div>
        </div>
      )}
    </section>
  );
}
