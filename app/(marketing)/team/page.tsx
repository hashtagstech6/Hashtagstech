import { Metadata } from "next";
import GlobalPartners from "@/components/sections/global-partners";
import CeoMessage from "@/components/sections/ceo-message";
import AboutUs from "@/components/sections/about-us";
import PageHeader from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Our Team | Hashtag Tech",
  description: "Meet the experts behind Hashtag Tech.",
};

export default function TeamPage() {
  return (
    <>
      <PageHeader
        title="Our Team"
        description="Meet the passionate minds driving innovation and digital transformation."
        pill="Team"
        breadcrumb={[{ label: "Team" }]}
      />
      <AboutUs />
      <div className="py-10" />
      <GlobalPartners />
      <CeoMessage />
    </>
  );
}
