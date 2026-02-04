import { Metadata } from "next";
import PageHeader from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Privacy Policy | Hashtag Tech",
  description: "Learn how Hashtag Tech collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        description="We are committed to protecting your privacy and ensuring your data is secure."
        pill="Legal"
        breadcrumb={[{ label: "Privacy Policy" }]}
      />

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
            <p className="lead text-lg text-muted-foreground mb-8">
              Thank you for visiting Hashtag Tech ("we," "us," "our"). This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our website and services. By accessing or using our Website, you agree to the practices described in this Policy.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">Personal Information</h3>
            <p>We may collect information that identifies you personally, such as:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number (if provided)</li>
              <li>Contact information you provide through forms or subscriptions</li>
            </ul>
            <p>This information is collected only when voluntarily submitted by you.</p>

            <h3 className="text-xl font-semibold mt-8 mb-4">Non-Personal Information</h3>
            <p>We automatically collect data that does not personally identify you, such as:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Browser type and version</li>
              <li>Device type and operating system</li>
              <li>IP address</li>
              <li>Pages visited and time spent on pages</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-6">2. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>To provide and improve our services</li>
              <li>To respond to your inquiries and support requests</li>
              <li>To send newsletters and promotional materials (you can opt-out at any time)</li>
              <li>To analyze website usage and improve user experience</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-6">3. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">4. Data Security</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-none pl-0 space-y-2 mt-4">
              <li><strong>Email:</strong> info@hashtagstech.com</li>
              <li><strong>Address:</strong> Business Bay, Dubai, UAE</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
