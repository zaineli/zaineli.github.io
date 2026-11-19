import { education, interests, links, metaDescription, pageTitle, profile } from "@/lib/content";

/**
 * Who the site is about, as search engines read it (components/JsonLd.tsx):
 * his name, photo and role, where he works (Alexein AI, linked to its site),
 * where he studied, what he works on, and his profiles elsewhere, so a
 * search for him or for the company can join them up. Everything here is on
 * the home page; the papers and write-ups point back to it by its @id.
 */

export const SITE_URL = "https://zainn.me";
export const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * His card on alexein.ai's about page, which gives him this same @id. It is
 * built and merged into Alexein-AI/twin-website's seo/foundations branch,
 * but not yet on its main, so the address is a 404 today. Flip this to true
 * once https://alexein.ai/about#zain-ali loads: the two pages then name each
 * other, and a search engine treats them as one person.
 */
export const ALEXEIN_ABOUT_LIVE = false;
const ALEXEIN_ABOUT = `${profile.companyUrl}/about#zain-ali`;

export const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: profile.name,
  givenName: "Zain",
  familyName: "Ali",
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/profile.webp`,
  jobTitle: profile.role,
  description: metaDescription,
  // The company by the @id alexein.ai gives it in its own structured data, with the same profiles.
  worksFor: {
    "@type": "Organization",
    "@id": `${profile.companyUrl}/#organization`,
    name: profile.company,
    url: profile.companyUrl,
    sameAs: profile.companyProfiles,
  },
  // The university by its own site and its Wikipedia and Wikidata entries, so it can't be read as another NUST.
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: education.school,
    url: "https://nust.edu.pk/",
    sameAs: [
      "https://en.wikipedia.org/wiki/National_University_of_Sciences_and_Technology_(Pakistan)",
      "https://www.wikidata.org/wiki/Q3696003",
    ],
  },
  knowsAbout: interests.map((i) => i.name),
  sameAs: [...links.filter((l) => l.external).map((l) => l.href), ...(ALEXEIN_ABOUT_LIVE ? [ALEXEIN_ABOUT] : [])],
};

/** The site itself: its name is the name a search page shows above every result from it. */
const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: profile.name,
  alternateName: "zainn.me",
  publisher: { "@id": PERSON_ID },
};

/** The home page: a profile of one person. */
export const profilePage = {
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/`,
  url: `${SITE_URL}/`,
  name: pageTitle,
  isPartOf: { "@id": WEBSITE_ID },
  mainEntity: person,
};

/** What the home page carries: the site, and the profile of the person it is about. */
export const homeGraph = { "@graph": [website, profilePage] };

/** The author of a paper or write-up: him, by the home page's @id. */
export const author = { "@type": "Person", "@id": PERSON_ID, name: profile.name, url: `${SITE_URL}/` };
