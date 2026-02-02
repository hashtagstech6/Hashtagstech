/**
 * Service type for homepage Services Grid section
 */

export type ServiceCategory =
  | "web-development"
  | "app-development"
  | "social-media-marketing"
  | "ai-services";

/**
 * Service interface
 *
 * Represents a service offering displayed in the homepage Services Grid section.
 */
export interface Service {
  /** Unique identifier */
  id: string;
  /** Service title */
  title: string;
  /** URL-friendly slug */
  slug: string;
  /** Service category */
  category: ServiceCategory;
  /** Short description (1-2 sentences) */
  shortDescription: string;
  /** List of key features/benefits */
  features: string[];
  /** Call-to-action button text */
  ctaText: string;
  /** Button style variant */
  ctaStyle: "primary" | "secondary";
  /** Display order */
  order: number;
}

/**
 * Sample services data
 *
 * Three main service offerings for Hashtag Tech
 */
export const services: Service[] = [
  {
    id: "1",
    title: "Web Development",
    slug: "web-development",
    category: "web-development",
    shortDescription:
      "Either 3D website or Full-Stack Application with modern design. We've got you covered",
    features: [
      "3D Experience Websites",
      "Full Stack Applications",
      "Ecommerce Stores",
      "SEO Optimised",
      "Aesthetic Figma Designs",
    ],
    ctaText: "Get Started",
    ctaStyle: "secondary",
    order: 1,
  },
  {
    id: "2",
    title: "App Development",
    slug: "app-development",
    category: "app-development",
    shortDescription:
      "Native iOS, Android, and cross-platform Flutter applications built for performance",
    features: [
      "iOS Development",
      "Android Development",
      "Flutter Apps",
      "UI/UX Design",
      "App Store Optimization",
    ],
    ctaText: "Get Started",
    ctaStyle: "secondary",
    order: 2,
  },
  {
    id: "3",
    title: "Social Media Marketing",
    slug: "social-media-marketing",
    category: "social-media-marketing",
    shortDescription:
      "Strategic social media campaigns that drive engagement and growth",
    features: [
      "Content Strategy",
      "Community Management",
      "Paid Advertising",
      "Analytics & Reporting",
      "Influencer Marketing",
    ],
    ctaText: "Get Started",
    ctaStyle: "primary",
    order: 3,
  },
];

export default Service;
