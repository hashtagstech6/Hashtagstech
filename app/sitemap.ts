import { MetadataRoute } from "next";

/**
 * Dynamic Sitemap
 *
 * T113 Create `app/sitemap.ts` dynamic sitemap with all pages
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hashtagstech.com";

  // Get all blog posts and careers from data
  const blogPosts = [
    "building-scalable-ai-agents",
    "future-of-web-development-2024",
    "mobile-app-native-vs-cross-platform",
  ];

  const careers = [
    "senior-full-stack-developer",
    "ai-ml-engineer",
    "ui-ux-designer",
  ];

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/career`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Blog post pages
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Career pages
  const careerPages: MetadataRoute.Sitemap = careers.map((slug) => ({
    url: `${baseUrl}/career/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages, ...careerPages];
}
