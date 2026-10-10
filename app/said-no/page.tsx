import type { Metadata } from "next";
import SaidNo from "@/components/sections/SaidNo";
import { negativeCount, profile, systems } from "@/lib/content";

export const metadata: Metadata = {
  title: "What said no",
  description: `${negativeCount} results that said no, across the ${systems.length} systems on the site. ${profile.ledgerLine}`,
  alternates: { canonical: "/said-no/" },
};

export default function SaidNoPage() {
  return <SaidNo />;
}
