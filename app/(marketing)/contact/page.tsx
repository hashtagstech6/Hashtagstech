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
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* UAE Office */}
              <div className="text-center">
                <h3 className="text-xl font-bold mb-3">UAE Office</h3>
                <p className="text-muted-foreground mb-2">Dubai, United Arab Emirates</p>
                <p className="text-sm text-muted-foreground">
                  <a
                    href="mailto:info@hashtagstech.com"
                    className="hover:text-primary transition-colors"
                  >
                    info@hashtagstech.com
                  </a>
                </p>
              </div>

              {/* USA Office */}
              <div className="text-center">
                <h3 className="text-xl font-bold mb-3">USA Office</h3>
                <p className="text-muted-foreground mb-2">New York, USA</p>
                <p className="text-sm text-muted-foreground">
                  <a
                    href="mailto:usa@hashtagstech.com"
                    className="hover:text-primary transition-colors"
                  >
                    usa@hashtagstech.com
                  </a>
                </p>
              </div>

              {/* 24/7 Support */}
              <div className="text-center">
                <h3 className="text-xl font-bold mb-3">24/7 Support</h3>
                <p className="text-muted-foreground mb-2">
                  Available round the clock
                </p>
                <p className="text-sm text-muted-foreground">
                  <a
                    href="mailto:support@hashtagstech.com"
                    className="hover:text-primary transition-colors"
                  >
                    support@hashtagstech.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>


    </>
  );
}
