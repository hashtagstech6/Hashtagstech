import type { Metadata } from "next";
import { Outfit } from "next/font/google";
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
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
