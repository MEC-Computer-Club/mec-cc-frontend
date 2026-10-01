import type { Metadata } from "next";
import { ProfileCard, ProfileGrid } from "@/components/ui/ProfileCard";
import { getAdvisors } from "@/lib/api/advisors";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Advisory Board & Faculty Mentors | MEC Computer Club",
  description:
    "Meet the honorable faculty advisors, academic mentors, and senior guides of the MEC Computer Club at Mymensingh Engineering College, Mymensingh.",
  keywords: [
    "MEC Computer Club advisors",
    "Mymensingh Engineering College faculty advisors",
    "MEC computer club mentors",
    "MEC CSE faculty",
  ],
  alternates: {
    canonical: "https://meccomputerclub.org/advisors",
  },
  openGraph: {
    title: "Advisory Board & Faculty Mentors | MEC Computer Club",
    description:
      "Honorable faculty advisors guiding student technology initiatives at Mymensingh Engineering College (MEC), Mymensingh.",
    url: "https://meccomputerclub.org/advisors",
    images: ["/mec-club-photo.jpg"],
  },
};

export default async function AdvisorsPage() {
  // Already ordered by designation precedence from DesignationManager
  const advisorsList = await getAdvisors();

  // Group by wing / panel for sectioned display
  const wingMap = new Map<string, typeof advisorsList>();
  const wingOrderMap = new Map<string, number>();

  for (const advisor of advisorsList) {
    const wing = advisor.wing || "Faculty Advisory";
    if (!wingMap.has(wing)) {
      wingMap.set(wing, []);
      wingOrderMap.set(wing, advisor.designationOrder ?? 999);
    }
    wingMap.get(wing)!.push(advisor);
  }

  const sortedWings = Array.from(wingMap.entries()).sort(
    ([wA], [wB]) => (wingOrderMap.get(wA) ?? 999) - (wingOrderMap.get(wB) ?? 999)
  );

  const hasWings = sortedWings.length > 1 || (sortedWings.length === 1 && sortedWings[0][0] !== "Faculty Advisory");

  return (
    <>
      <section className="pt-10 md:pt-14 pb-8 md:pb-10 text-center">
        <div className="container mx-auto px-4 md:px-8">
          <span className="kicker">Guidance &amp; Vision</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary my-3">
            Our Honorable Advisors
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-[600px] mx-auto">
            Meet the experienced mentors who guide our club towards excellence and innovation.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-surface-secondary">
        <div className="container mx-auto px-4 md:px-8">
          {advisorsList.length === 0 ? (
            <p className="text-center text-text-secondary py-12">
              No advisor records found yet.
            </p>
          ) : hasWings ? (
            /* ── Grouped by Wing / Panel ── */
            <div className="space-y-12">
              {sortedWings.map(([wing, members]) => (
                <div key={wing}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px flex-1 bg-border-default" />
                    <span className="px-4 py-1 text-xs font-bold uppercase tracking-widest text-text-secondary border border-border-default rounded-full bg-surface-primary whitespace-nowrap">
                      {wing}
                    </span>
                    <div className="h-px flex-1 bg-border-default" />
                  </div>
                  <ProfileGrid className="stagger-children">
                    {members.map((advisor) => (
                      <ProfileCard
                        key={advisor.id}
                        slug={advisor.id}
                        name={advisor.name}
                        role={advisor.role}
                        department={advisor.department}
                        session={
                          advisor.academicPost ||
                          (advisor.department ? `Dept. of ${advisor.department}` : "Faculty")
                        }
                        image={advisor.image}
                        imagePosition={advisor.imagePosition}
                        sublabel="FACULTY"
                        category="advisor"
                        hideRoleBadges={true}
                        socials={advisor.socials}
                      />
                    ))}
                  </ProfileGrid>
                </div>
              ))}
            </div>
          ) : (
            /* ── Flat grid (no wings configured) ── */
            <ProfileGrid className="stagger-children">
              {advisorsList.map((advisor) => (
                <ProfileCard
                  key={advisor.id}
                  slug={advisor.id}
                  name={advisor.name}
                  role={advisor.role}
                  department={advisor.department}
                  session={
                    advisor.academicPost ||
                    (advisor.department ? `Dept. of ${advisor.department}` : "Faculty")
                  }
                  image={advisor.image}
                  imagePosition={advisor.imagePosition}
                  sublabel="FACULTY"
                  category="advisor"
                  hideRoleBadges={true}
                  socials={advisor.socials}
                />
              ))}
            </ProfileGrid>
          )}
        </div>
      </section>
    </>
  );
}
