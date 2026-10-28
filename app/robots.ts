import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/structured";

/** robots.txt: every page may be crawled, and here is the sitemap. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
