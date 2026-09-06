import type { Metadata } from "next";
import CaseStudyView from "@/components/CaseStudyView";
import { caseStudies } from "@/lib/content";

const study = caseStudies["distributed-ml"];

export const metadata: Metadata = {
  title: study.title,
  description: study.tagline,
};

export default function Page() {
  return <CaseStudyView study={study} />;
}
