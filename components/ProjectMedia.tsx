import Image from "next/image";
import type { Media } from "@/lib/content";

/**
 * Renders real project media — a looping muted video or a next/image — to fill
 * its (relatively-positioned, aspect-locked) parent. Diagrams use `fit:"contain"`
 * with a muted backdrop so they frame cleanly; screenshots/clips use cover.
 */
export default function ProjectMedia({
  media,
  sizes = "(min-width: 768px) 60vw, 100vw",
  priority = false,
}: {
  media: Media;
  sizes?: string;
  priority?: boolean;
}) {
  const fit = media.fit === "contain" ? "object-contain" : "object-cover";

  if (media.kind === "video") {
    // controls => a real player (no autoplay); otherwise an ambient autoplay loop.
    const playerProps = media.controls
      ? { controls: true, preload: "metadata" as const }
      : { autoPlay: true, loop: true, preload: "metadata" as const, "aria-hidden": true as const };
    return (
      <video
        className={`h-full w-full ${fit} bg-bg-muted`}
        poster={media.poster}
        muted
        playsInline
        {...playerProps}
      >
        <source src={media.src} type="video/mp4" />
      </video>
    );
  }

  return (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`${fit} bg-bg-muted`}
    />
  );
}
