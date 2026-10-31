import { education, interests, links, profile } from "@/lib/content";

/**
 * Who the site is about, as search engines read it (components/JsonLd.tsx):
 * his name, photo and role, where he works (Alexein AI, linked to its site),
 * where he studied, what he works on, and his profiles elsewhere, so a
 * search for him or for the company can join them up. Everything here is on
 * the home page; the papers and write-ups point back to it by its @id.
 */

export const SITE_URL = "https://zainn.me";
export const PERSON_ID = `${SITE_URL}/#person`;

export const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: profile.name,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/profile.webp`,
  jobTitle: profile.role,
  // The company by the @id alexein.ai gives it in its own structured data, with the same profiles.
  worksFor: {
    "@type": "Organization",
    "@id": `${profile.companyUrl}/#organization`,
    name: profile.company,
    url: profile.companyUrl,
    sameAs: profile.companyProfiles,
  },
  alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
  knowsAbout: interests.map((i) => i.name),
  sameAs: links.filter((l) => l.external).map((l) => l.href),
};

/** The home page: a profile of one person. */
export const profilePage = {
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/`,
  url: `${SITE_URL}/`,
  name: `${profile.name} · ${profile.role}, ${profile.company}`,
  mainEntity: person,
};

/** The author of a paper or write-up: him, by the home page's @id. */
export const author = { "@type": "Person", "@id": PERSON_ID, name: profile.name, url: `${SITE_URL}/` };
