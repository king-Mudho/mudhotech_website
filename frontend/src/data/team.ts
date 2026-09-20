export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

/**
 * TODO(content): every entry here is a placeholder — the names are literally
 * "Team Member" over stock portraits, which is why the Our Team section is
 * not currently rendered on /about.
 *
 * To bring it back: fill in real names and photographs (drop the images in
 * public/images/), then restore the section in app/about/page.tsx — there is
 * a comment there marking where it went. See docs/OPEN-QUESTIONS.md #4.
 */
export const team: TeamMember[] = [
  { name: "Team Member", role: "Founder & Managing Director", image: "/images/team-ceo.jpg" },
  { name: "Team Member", role: "Lead Developer", image: "/images/team-dev.jpg" },
  { name: "Team Member", role: "IT Support Technician", image: "/images/team-tech.jpg" },
  { name: "Team Member", role: "Operations", image: "/images/team-ops.jpg" },
];
