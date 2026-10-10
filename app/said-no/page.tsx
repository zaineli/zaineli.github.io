import type { Metadata } from "next";
import SaidNo from "@/components/sections/SaidNo";
import { negativeCount, systems } from "@/lib/content";

export const metadata: Metadata = {
  title: "What didn’t work",
  description: `${negativeCount} things that didn’t work, across the ${systems.length} projects on the site, each with the number that showed it.`,
  alternates: { canonical: "/said-no/" },
};

export default function SaidNoPage() {
  return <SaidNo />;
}
