import type { MetadataRoute } from "next";
import { publications, systems, techPath } from "@/lib/content";
import { SITE_URL } from "@/lib/structured";

/**
 * sitemap.xml: every page the export builds, and nothing it doesn't (the
 * same lists the routes' static params come from, so a held or unreleased
 * page can't appear here). Addresses end in "/", as trailingSlash serves
 * them. No dates: a page's date would be a guess.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/said-no/",
    ...systems.map((s) => `/systems/${s.slug}/`),
    ...systems.filter((s) => s.brief).map(techPath),
    ...publications.map((p) => `/papers/${p.slug}/`),
  ];
  return paths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
