import Link from "next/link";
import Image from "next/image";

/**
 * Footer Component
 *
 * Site footer with Get In Touch column, Quick Links column, social links, and copyright bar.
 * Displays office locations (UAE, USA, Oman), email addresses, and 24/7 support note.
 *
 * Features:
 * - Contact information column
 * - Quick links navigation
 * - Social media links
 * - Copyright bar
 * - Responsive layout (stacks on mobile)
 *
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const contactInfo = {
    emails: [
      { label: "General Inquiries", email: "info@hashtagstech.com" },
      { label: "Careers", email: "careers@hashtagstech.com" },
      { label: "Support", email: "support@hashtagstech.com" },
    ],
    offices: [
      { city: "Dubai", country: "UAE", address: "Business Bay, Dubai" },
      { city: "New York", country: "USA", address: "Manhattan, NY 10001" },
      { city: "Muscat", country: "Oman", address: "Al Seeb, Muscat" },
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

  const socialLinks = [
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/hashtag-tech",
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "https://twitter.com/hashtagtech",
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com/hashtagtech",
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
  ];

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
                src="/logo-horizontal.webp"
                alt="Hashtag Tech"
                width={140}
                height={37}
                className="h-9 w-auto opacity-90"
              />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              We build world-class web and mobile applications powered by cutting-edge AI technology. Partner with us to transform your digital presence.
            </p>
            {/* Social Links Moved Here */}
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-primary hover:bg-white/5 transition-all duration-300 rounded-full p-2 border border-white/10 hover:border-primary/50"
                  aria-label={`Follow us on ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
              Services
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Web Development", href: "/#services" },
                { name: "App Development", href: "/#services" },
                { name: "AI Integration", href: "/#services" },
                { name: "Digital Marketing", href: "/#services" },
                { name: "UI/UX Design", href: "/#services" },
              ].map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="group flex items-center text-sm text-white/60 hover:text-primary hover:no-underline transition-colors duration-300"
                  >
                    <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 text-primary mr-0 group-hover:mr-2">
                       &gt;
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {service.name}
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
                  {contactInfo.emails.slice(0, 2).map((email) => (
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
                  {contactInfo.offices.slice(0, 2).map((office) => (
                    <li
                      key={office.city}
                      className="text-sm text-white/60"
                    >
                      {office.city}, {office.country}
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
            &copy; {currentYear} Hashtag Tech. All rights reserved.
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
