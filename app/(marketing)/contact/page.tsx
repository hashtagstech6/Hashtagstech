import { Metadata } from "next";
import ContactForm from "@/components/forms/contact-form";
import Header from "@/components/layout/header";
import PageHeader from "@/components/layout/page-header";


/**
 * Contact Page Metadata
 */
export const metadata: Metadata = {
  title: "Contact Us | Hashtag Tech",
  description:
    "Get in touch with Hashtag Tech. We'd love to hear about your project and discuss how we can help transform your digital presence.",
  openGraph: {
    title: "Contact Us | Hashtag Tech",
    description:
      "Get in touch with Hashtag Tech. We'd love to hear about your project and discuss how we can help transform your digital presence.",
    type: "website",
  },
};

/**
 * Contact Page Component
 *
 * Features:
 * - Contact form with validation
 * - Office locations
 * - Email addresses
 * - 24/7 support note
 *
 * @example
 * ```tsx
 * // Visited at /contact
 * ```
 */
export default function ContactPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Page Header */}
        <PageHeader
          title="Get In Touch"
          description="Ready to start your project? Fill out the form below and we'll get back to you within 24 hours."
          pill="Contact Us"
          breadcrumb={[{ label: "Contact" }]}
        />

        {/* Contact Form Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Email */}
              <div className="text-center">
                <h3 className="text-xl font-bold mb-3">Email Us</h3>
                <p className="text-muted-foreground mb-2">
                  We&apos;d love to hear from you
                </p>
                <p className="text-sm text-muted-foreground">
                  <a
                    href="mailto:info@hashtagstech.com"
                    className="hover:text-primary transition-colors"
                  >
                    info@hashtagstech.com
                  </a>
                </p>
              </div>

              {/* Operating Locations */}
              <div className="text-center">
                <h3 className="text-xl font-bold mb-3">Our Presence</h3>
                <p className="text-muted-foreground mb-2">
                  Operating in Pakistan, Dubai &amp; Germany
                </p>
                <p className="text-sm text-muted-foreground">
                  Available 24/7 for support
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>


    </>
  );
}
