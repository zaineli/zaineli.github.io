import type { Metadata } from "next";
import CaseStudyView from "@/components/CaseStudyView";
import ChatlyMakeArchitecture from "@/components/ChatlyMakeArchitecture";
import { caseStudies } from "@/lib/content";

const study = caseStudies["chatly-make"];

export const metadata: Metadata = {
  title: study.title,
  description: study.tagline,
};

export default function Page() {
  return <CaseStudyView study={study} topSlot={<ChatlyMakeArchitecture />} />;
}
