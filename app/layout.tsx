import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hashtag Tech - Web & App Development Services",
  description:
    "Leading digital agency specializing in web development, app development, social media marketing, and AI solutions. Transform your business with cutting-edge technology.",
  keywords: [
    "web development",
    "app development",
    "social media marketing",
    "AI solutions",
    "digital agency",
    "Hashtag Tech",
  ],
  authors: [{ name: "Hashtag Tech" }],
  openGraph: {
    title: "Hashtag Tech - Web & App Development Services",
    description:
      "Leading digital agency specializing in web development, app development, social media marketing, and AI solutions.",
    type: "website",
    url: "https://hashtagstech.com",
    siteName: "Hashtag Tech",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hashtag Tech - Web & App Development Services",
    description:
      "Leading digital agency specializing in web development, app development, social media marketing, and AI solutions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="min-h-screen flex flex-col">
        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
        >
          Skip to main content
        </a>

        {/* Header */}
        <Header />

        {/* Main Content */}
        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
