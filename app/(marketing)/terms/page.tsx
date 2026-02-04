import { Metadata } from "next";
import PageHeader from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Terms and Conditions | Hashtag Tech",
  description: "Read our terms and conditions for using Hashtag Tech services and website.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terms and Conditions"
        description="Please read these terms carefully before using our services."
        pill="Legal"
        breadcrumb={[{ label: "Terms" }]}
      />

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
            <p className="lead text-lg text-muted-foreground mb-8">
              Welcome to Hashtag Tech. These Terms and Conditions outline the rules and regulations for the use of Hashtag Tech's Website and services.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">1. Use of the Website</h2>
            <p>By using this website, you agree to the following:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>You must be at least 18 years of age to use this website.</li>
              <li>You will not use the website for any illegal or unauthorized purpose.</li>
              <li>You will not attempt to hack, destabilize, or adapt the website or its code.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-6">2. Intellectual Property Rights</h2>
            <p>
              Other than the content you own, under these Terms, Hashtag Tech and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">3. Restrictions</h2>
            <p>You are specifically restricted from all of the following:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Publishing any Website material in any other media</li>
              <li>Selling, sublicensing and/or otherwise commercializing any Website material</li>
              <li>Publicly performing and/or showing any Website material</li>
              <li>Using this Website in any way that is or may be damaging to this Website</li>
              <li>Using this Website in any way that impacts user access to this Website</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-6">4. Limitation of Liability</h2>
            <p>
              In no event shall Hashtag Tech, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Hashtag Tech, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">5. Changes to Terms</h2>
            <p>
              Hashtag Tech is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">6. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at info@hashtagstech.com.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
