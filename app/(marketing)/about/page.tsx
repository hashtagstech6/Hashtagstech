import { Metadata } from "next";
import GlobalPartners from "@/components/sections/global-partners";
import CeoMessage from "@/components/sections/ceo-message";
import AboutUs from "@/components/sections/about-us";
import PageHeader from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "About Us | Hashtag Tech",
  description: "Learn more about Hashtag Tech and our mission.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Us"
        description="We are the passionate minds driving innovation and digital transformation."
        pill="Company"
        breadcrumb={[{ label: "About" }]}
      />
      <AboutUs />
      <div className="py-10" />
      <GlobalPartners />
      <CeoMessage />
    </>
  );
}
