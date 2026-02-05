"use client"; // Not needed if server component, but we'll see. Actually TeamList will be server component.

import Image from "next/image";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  department?: string;
  photo?: {
    asset?: { url?: string };
    alt?: string;
  };
  image?: {
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
    // Use relative URL for internal API calls (works in dev and production)
    const response = await fetch("/api/team", {
      cache: 'force-cache', // Use cache for ISR
    });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

export default async function TeamList() {
  const teamMembers = await getTeamMembers();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {teamMembers.map((member) => (
        <div key={member._id} className="group">
          <div className="relative overflow-hidden rounded-lg aspect-[4/5] mb-6 bg-muted">
            <Image
              src={member.photo?.asset?.url || member.image?.asset?.url || "/placeholder.svg"}
              alt={member.photo?.alt || member.image?.alt || member.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              unoptimized={!!(member.photo?.asset?.url || member.image?.asset?.url)}
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
  );
}
