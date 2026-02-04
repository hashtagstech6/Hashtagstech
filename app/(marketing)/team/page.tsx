import { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Our Team | Hashtag Tech",
  description: "Meet the experts behind Hashtag Tech.",
};

const teamMembers = [
  {
    name: "David Roberts",
    role: "Chief Executive Officer",
    image: "https://placehold.co/400x500/1a1a1a/FFF?text=David",
  },
  {
    name: "Sarah Mitchell",
    role: "Chief Operations Officer",
    image: "https://placehold.co/400x500/1a1a1a/FFF?text=Sarah",
  },
  {
    name: "James Wilson",
    role: "Lead Developer",
    image: "https://placehold.co/400x500/1a1a1a/FFF?text=James",
  },
  {
    name: "Emily Parker",
    role: "Creative Director",
    image: "https://placehold.co/400x500/1a1a1a/FFF?text=Emily",
  },
];

export default function TeamPage() {
  return (
    <>
      <PageHeader
        title="Meet The Team"
        description="DevMate — Tech Wizards"
        pill="Team"
        breadcrumb={[{ label: "Team" }]}
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden rounded-lg aspect-[4/5] mb-6 bg-muted">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    unoptimized // Needed for external placehold.co images without config
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
