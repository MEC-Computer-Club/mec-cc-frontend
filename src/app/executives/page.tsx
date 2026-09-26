import type { Metadata } from "next";
import { ProfileCard, ProfileGrid } from "@/components/ui/ProfileCard";
import { getExecutives, getExecutiveDesignationRank } from "@/data/executives";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Executive Committee & Student Leaders | MEC Computer Club",
  description:
    "Meet the executive committee and student leadership driving the MEC Computer Club forward at Mymensingh Engineering College, Mymensingh. Hierarchical executive panels, presidents, and secretaries.",
  keywords: [
    "MEC Computer Club executives",
    "MEC CC executive committee",
    "MEC CC leadership",
    "Mymensingh Engineering College computer club leaders",
    "MEC CSE executives",
    "MEC Computer Club president",
  ],
  alternates: {
    canonical: "https://meccomputerclub.org/executives",
  },
  openGraph: {
    title: "Executive Committee & Leadership | MEC Computer Club",
    description:
      "Meet the student leaders driving the MEC Computer Club at Mymensingh Engineering College, Mymensingh. Executive panel hierarchy and leads.",
    url: "https://meccomputerclub.org/executives",
    images: ["/mec-club-photo.jpg"],
  },
};

export default async function ExecutivesPage() {
  const executivesList = await getExecutives();

  // Sort strictly by designation hierarchy
  const sortedExecutives = [...executivesList].sort((a, b) => {
    const rankA = getExecutiveDesignationRank(a.role);
    const rankB = getExecutiveDesignationRank(b.role);
    if (rankA !== rankB) return rankA - rankB;
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      <section className="pt-8 pb-4">
        <div className="container mx-auto px-4 md:px-8">
          <span className="kicker">Leadership</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-2">
            Root Users (Executive Panel)
          </h1>
          <p className="text-xl text-text-secondary max-w-[600px] mt-3">
            Meet the dedicated student leaders who run the operations and drive the vision of the MEC Computer Club.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-surface-secondary">
        <div className="container mx-auto px-4 md:px-8">
          {sortedExecutives.length === 0 ? (
            <p className="text-center text-text-secondary py-12">
              No executive records found yet.
            </p>
          ) : (
            <ProfileGrid className="stagger-children">
              {sortedExecutives.map((exec) => (
                <ProfileCard
                  key={exec.id}
                  slug={exec.id}
                  name={exec.name}
                  role={exec.role}
                  department={exec.department}
                  session={exec.session}
                  batch={exec.batch}
                  category="executive"
                  hideRoleBadges={true}
                  image={exec.image}
                  imagePosition={exec.imagePosition}
                  socials={exec.socials}
                />
              ))}
            </ProfileGrid>
          )}
        </div>
      </section>
    </>
  );
}
