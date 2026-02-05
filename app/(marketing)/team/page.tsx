import { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/layout/page-header";
import TeamList from "@/components/sections/team-list";
import { TeamGridSkeleton } from "@/components/skeletons/team-grid-skeleton";

export const metadata: Metadata = {
  title: "Our Team | Hashtag Tech",
  description: "Meet the experts behind Hashtag Tech.",
};

export default function TeamPage() {
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
          <Suspense fallback={<TeamGridSkeleton />}>
            <TeamList />
          </Suspense>
        </div>
      </section>
    </>
  );
}
