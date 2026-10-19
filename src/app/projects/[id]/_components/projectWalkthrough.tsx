"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { durationLabel, type GalleryImage, type ProjectVideo } from "@/lib/projectMedia";

/**
 * A recorded walkthrough of the project, served from /public/videos.
 *
 * preload="none" so a visitor who never presses play downloads only the
 * poster, not megabytes of video. The 16:10 box matches the recordings
 * (1280×800) and reserves the space before anything loads, so nothing shifts.
 */
export function ProjectVideoPlayer({ video, title }: { video: ProjectVideo; title: string }) {
  return (
    <figure>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
        <video
          className="absolute inset-0 h-full w-full"
          controls
          playsInline
          preload="none"
          poster={video.poster}
          width={1280}
          height={800}
          aria-label={`${title} walkthrough video`}
        >
          <source src={video.src} type="video/mp4" />
          <a href={video.src} className="text-teal-400 underline">
            Download the {title} walkthrough
          </a>
        </video>
      </div>
      <figcaption className="mt-3 flex items-start justify-between gap-4 text-sm leading-relaxed text-gray-400">
        <span>{video.caption}</span>
        <span className="shrink-0 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs text-gray-400">
          {durationLabel(video.duration)}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Three screenshots with a lightbox on a native <dialog>.
 *
 * showModal() gives the dialog the top layer, makes the rest of the page inert
 * and moves focus inside; Escape closes it natively. Arrow keys step through
 * the images, and focus returns to the thumbnail that opened it. The full-size
 * image is only rendered while the dialog is open, so the gallery costs three
 * lazy thumbnails until someone asks for more.
 */
export function ProjectGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const count = images.length;

  const step = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + count) % count)),
    [count]
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (index === null || !dialog || dialog.open) return;
    dialog.showModal();
    // The page behind a modal dialog still scrolls; hold it still while open.
    document.documentElement.style.overflow = "hidden";
  }, [index]);

  const onClose = () => {
    document.documentElement.style.overflow = "";
    setIndex(null);
    openerRef.current?.focus();
  };

  if (!count) return null;
  const current = index === null ? null : images[index];

  return (
    <>
      <ul className="grid list-none grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((img, i) => (
          <li key={img.src} className={i === 0 ? "col-span-2 sm:col-span-1" : undefined}>
            <button
              type="button"
              onClick={(e) => {
                openerRef.current = e.currentTarget;
                setIndex(i);
              }}
              className="group relative block aspect-[1280/769] w-full overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] transition-colors hover:border-teal-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
              aria-label={`Open image ${i + 1} of ${count}: ${img.alt}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 280px"
              />
              <span
                aria-hidden="true"
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/70 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={`${title} screens`}
        onClose={onClose}
        onClick={(e) => {
          // A click on the backdrop lands on the dialog element itself.
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
        }}
        className="fixed inset-0 m-0 h-full max-h-full w-full max-w-full flex-col items-center justify-center gap-4 bg-[#050505] p-4 text-white backdrop:bg-black/80 open:flex sm:p-8"
      >
        {current && (
          <>
            <div className="flex w-full max-w-[1280px] items-center justify-between gap-4">
              <p className="font-mono text-xs text-gray-400" aria-live="polite">
                {index! + 1} / {count}
              </p>
              <button
                type="button"
                autoFocus
                onClick={() => dialogRef.current?.close()}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-gray-200 transition-colors hover:border-teal-500/40 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <figure className="flex min-h-0 w-full max-w-[1280px] flex-1 flex-col items-center justify-center gap-3">
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                width={2560}
                height={1538}
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="h-auto max-h-[72dvh] w-auto max-w-full rounded-xl border border-white/10 object-contain"
              />
              <figcaption className="text-center text-sm text-gray-400">{current.alt}</figcaption>
            </figure>

            {count > 1 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-gray-200 transition-colors hover:border-teal-500/40 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-gray-200 transition-colors hover:border-teal-500/40 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </dialog>
    </>
  );
}
