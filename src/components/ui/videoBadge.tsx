import { Play } from "lucide-react";
import { projectVideo } from "@/lib/projectMedia";

/**
 * "Video" chip for a project card whose page has a walkthrough. Renders
 * nothing for a project without one, so cards for the rest are unchanged.
 * No hooks: it works in server and client components alike.
 */
export function VideoBadge({ video, className = "" }: { video: unknown; className?: string }) {
  if (!projectVideo(video)) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-teal-500/30 bg-black/75 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wide text-teal-300 backdrop-blur-md ${className}`}
    >
      <Play className="h-2.5 w-2.5 fill-teal-300" aria-hidden="true" />
      Video
    </span>
  );
}
