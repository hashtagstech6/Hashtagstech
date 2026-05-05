import Link from "next/link";
import Image from "next/image";
import { getClient } from "@/sanity/lib/client";

interface Service {
  _id: string;
  title: string;
  slug: string;
  order: number;
}

interface SiteSettings {
  footerLogo?: {
    asset?: { url?: string };
    alt?: string;
  };
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
  contactEmails?: Array<{
    label: string;
    email: string;
  }>;
}

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
 * Footer Component
 */
export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const client = getClient();

  // Fetch Services Dynamically
  let services: Service[] = [];
  let settings: SiteSettings = {};

  try {
    if (client) {
      const servicesQuery = `
        *[_type == "service" && isActive == true] | order(order asc) {
          _id,
          title,
          "slug": slug.current,
          order
        }
      `;
      const settingsQuery = `*[_type == "siteSettings"] | order(_updatedAt desc)[0] {
        footerLogo {
          asset->{ url },
          alt
        },
        socialLinks[] {
          platform,
          url
        },
        contactEmails[] {
          label,
          email
        }
      }`;

      [services, settings] = await Promise.all([
        client.fetch(servicesQuery, {}, { useCdn: false }),
        client.fetch(settingsQuery, {}, { useCdn: false, next: { tags: ["siteSettings"] } }),
      ]);
    }
  } catch (error) {
    console.error("Error fetching data for footer:", error);
    // Fallback to static services if fetch fails
    services = [
      { _id: "1", title: "Web Development", slug: "web-development", order: 1 },
      { _id: "2", title: "App Development", slug: "app-development", order: 2 },
      { _id: "3", title: "AI Integration", slug: "ai-integration", order: 3 },
      { _id: "4", title: "Digital Marketing", slug: "digital-marketing", order: 4 },
      { _id: "5", title: "UI/UX Design", slug: "ui-ux-design", order: 5 },
    ];
  }

  // Ensure settings is not null
  const safeSettings = settings || {};

  // Use dynamic emails from Sanity if available, otherwise use defaults
  const contactEmails = safeSettings.contactEmails?.length 
    ? safeSettings.contactEmails 
    : [
        { label: "General Inquiries", email: "hello@hashtagstech.com" },
        { label: "Careers", email: "careers@hashtagstech.com" },
      ];

  const contactInfo = {
    emails: contactEmails,
    offices: [
      { city: "Europe", country: "" },
      { city: "Middle East", country: "" },
      { city: "Pakistan", country: "" },
    ],
  };

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/#services" },
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/team" },
    { name: "Careers", href: "/career" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  // Default social links if none in Sanity
  const defaultSocialLinks = [
    { name: "LinkedIn", href: "https://linkedin.com/company/hashtag-tech", platform: "linkedin" },
    { name: "Twitter", href: "https://twitter.com/hashtagtech", platform: "twitter" },
    { name: "Instagram", href: "https://instagram.com/hashtagtech", platform: "instagram" },
  ];

  // Use dynamic social links from Sanity if available, otherwise use defaults
  const activeSocialLinks = safeSettings.socialLinks?.length 
    ? safeSettings.socialLinks
        .filter(s => s.url && s.url.trim() !== "" && s.platform)
        .map(s => ({ 
          platform: s.platform, 
          url: s.url 
        }))
    : defaultSocialLinks.map(s => ({ 
        platform: s.platform, 
        url: s.href 
      }));

  return (
    <footer className="border-t border-white/10 bg-black text-white relative overflow-hidden">
      {/* Background Pattern - Large Text Trace */}
      <div className="absolute -top-[10%] -right-[5%] text-[15rem] font-black text-white/[0.02] pointer-events-none select-none leading-none z-0">
        HASHTAG
      </div>

      <div className="container mx-auto px-4 pt-16 pb-8 relative z-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-6">
            <Link href="/" className="block">
              <Image
                src={safeSettings.footerLogo?.asset?.url || "/logo-horizontal.webp"}
                alt={safeSettings.footerLogo?.alt || "Hashtag Tech"}
                width={280}
                height={88}
                className="h-20 w-auto opacity-90"
              />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              We build world-class web and mobile applications powered by cutting-edge AI technology. Partner with us to transform your digital presence.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
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
                
                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-primary hover:bg-white/5 transition-all duration-300 rounded-full p-2 border border-white/10 hover:border-primary/50"
                    aria-label={`Follow us on ${social.platform || "Social Media"}`}
                  >
                    {Icon ? (
                      <Icon className="h-6 w-6" />
                    ) : (
                      <Share2 className="h-6 w-6" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
              Services
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service._id}>
                  <Link
                    href={`/#${service.slug}`}
                    className="group flex items-center text-sm text-white/60 hover:text-primary hover:no-underline transition-colors duration-300"
                  >
                    <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 text-primary mr-0 group-hover:mr-2">
                       &gt;
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {service.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company (Quick Links) */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-white/60 hover:text-primary hover:no-underline transition-colors duration-300"
                  >
                    <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 text-primary mr-0 group-hover:mr-2">
                       &gt;
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
              Contact
            </h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Email</p>
                <div className="space-y-2">
                  {contactInfo.emails.map((email) => (
                    <a
                      key={email.label}
                      href={`mailto:${email.email}`}
                      className="block text-sm text-white/80 hover:text-primary hover:no-underline transition-colors"
                    >
                      {email.email}
                    </a>
                  ))}
                </div>
              </div>

               <div className="space-y-3">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Offices</p>
                <ul className="space-y-2">
                  {contactInfo.offices.map((office) => (
                    <li
                      key={office.city}
                      className="text-sm text-white/60"
                    >
                      {office.city}{office.country ? `, ${office.country}` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            Made with love at Hashtags Technology | All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/40">
             <Link href="/privacy" className="hover:text-white hover:no-underline transition-colors">Privacy Policy</Link>
             <Link href="/terms" className="hover:text-white hover:no-underline transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
