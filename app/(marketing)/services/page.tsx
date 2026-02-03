import { Metadata } from "next";
import ServicesGrid from "@/components/sections/services-grid";
import AIServices from "@/components/sections/ai-services";
import PageHeader from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Our Services | Hashtag Tech",
  description: "Explore our comprehensive range of AI-powered software development and digital marketing services.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Our Services"
        description="Comprehensive digital solutions powered by cutting-edge AI technology."
        pill="Services"
        breadcrumb={[{ label: "Services" }]}
      />
      <ServicesGrid />
      <AIServices />
    </>
  );
}
