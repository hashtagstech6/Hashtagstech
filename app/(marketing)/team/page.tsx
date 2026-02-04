import { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Our Team | Hashtag Tech",
  description: "Meet the experts behind Hashtag Tech.",
};

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  department?: string;
  photo?: {
    asset?: { url?: string };
    alt?: string;
  };
  bio?: string;
  skills?: string[];
  email?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/team`, {
      cache: 'force-cache', // Use cache for ISR
    });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

export default async function TeamPage() {
  const teamMembers = await getTeamMembers();

  return (
    <>
      <PageHeader
        title="Meet The Team"
        description="Hashtag Tech - Tech Wizards"
        pill="Team"
        breadcrumb={[{ label: "Team" }]}
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member._id} className="group">
                <div className="relative overflow-hidden rounded-lg aspect-[4/5] mb-6 bg-muted">
                  <Image
                    src={member.photo?.asset?.url || "https://placehold.co/400x500/1a1a1a/FFF?text=" + encodeURIComponent(member.name)}
                    alt={member.photo?.alt || member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    unoptimized={!!member.photo?.asset?.url}
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
