import { Metadata } from "next";
import ContactForm from "@/components/forms/contact-form";
import Header from "@/components/layout/header";
import PageHeader from "@/components/layout/page-header";
import { getClient } from "@/sanity/lib/client";
import { 
  Linkedin, 
  Facebook, 
  Instagram, 
  Github, 
  Youtube,
  Share2 
} from "lucide-react";

const XIcon = (props: any) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const platformIcons: Record<string, any> = {
  linkedin: Linkedin,
  "LinkedIn": Linkedin,
  twitter: XIcon,
  "Twitter": XIcon,
  "twitter / x": XIcon,
  "twitter/x": XIcon,
  "Twitter / X": XIcon,
  "Twitter/X": XIcon,
  "x": XIcon,
  "X": XIcon,
  facebook: Facebook,
  "Facebook": Facebook,
  instagram: Instagram,
  "Instagram": Instagram,
  github: Github,
  "GitHub": Github,
  youtube: Youtube,
  "YouTube": Youtube,
};

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
 */
export default async function ContactPage() {
  const client = getClient();
  let contactEmails = [
    { label: "General Inquiries", email: "hello@hashtagstech.com" }
  ];
  let activeSocialLinks: any[] = [
    { platform: "linkedin", url: "https://linkedin.com/company/hashtag-tech" },
    { platform: "twitter", url: "https://twitter.com/hashtagtech" },
    { platform: "instagram", url: "https://instagram.com/hashtagtech" },
  ];

  try {
    if (client) {
      const query = `*[_type == "siteSettings"] | order(_updatedAt desc)[0]{ contactEmails, socialLinks }`;
      const settings = await client.fetch(query, {}, { 
        next: { tags: ["siteSettings"] },
        useCdn: false 
      });
      
      if (settings?.contactEmails?.length) {
        contactEmails = settings.contactEmails;
      }

      if (settings?.socialLinks?.length) {
        activeSocialLinks = settings.socialLinks.filter((s: any) => s.url && s.url.trim() !== "");
      }
    }
  } catch (error) {
    console.error("Error fetching settings for contact page:", error);
  }

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
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Email Addresses */}
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold mb-3">Email Us</h3>
                <p className="text-muted-foreground mb-4">
                  We&apos;d love to hear from you
                </p>
                <div className="space-y-3">
                  {contactEmails.map((item, idx) => (
                    <div key={idx}>
                      <p className="text-xs font-bold uppercase text-primary tracking-widest mb-1">{item.label}</p>
                      <a
                        href={`mailto:${item.email}`}
                        className="text-sm font-medium hover:text-primary transition-colors underline-offset-4 hover:underline"
                      >
                        {item.email}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operating Locations */}
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold mb-3">Our Presence</h3>
                <p className="text-muted-foreground mb-4">
                  Operating globally
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                   <p>Europe</p>
                   <p>Middle East</p>
                   <p>Pakistan</p>
                   <p className="pt-2 font-bold text-foreground">Available 24/7 for support</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold mb-3">Connect</h3>
                <p className="text-muted-foreground mb-4">
                  Follow our journey
                </p>
                <div className="flex justify-center gap-4">
                  {activeSocialLinks.map((social, idx) => {
                    const platformKey = (social.platform || "").trim().toLowerCase();
                    const rawKey = (social.platform || "").trim();
                    let Icon = platformIcons[platformKey] || platformIcons[rawKey];
                    
                    // Extra robust platform detection from key or URL
                    if (!Icon) {
                      const combined = (platformKey + " " + (social.url || "").toLowerCase());
                      if (combined.includes("instagram")) Icon = Instagram;
                      else if (combined.includes("linkedin")) Icon = Linkedin;
                      else if (combined.includes("facebook")) Icon = Facebook;
                      else if (combined.includes("twitter") || combined.includes("x.com")) Icon = XIcon;
                      else if (combined.includes("github")) Icon = Github;
                      else if (combined.includes("youtube")) Icon = Youtube;
                    }

                    if (!Icon) Icon = Share2;

                    return (
                      <a
                        key={idx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300"
                        title={social.platform}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
