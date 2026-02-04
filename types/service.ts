/**
 * Service type for homepage Services Grid section
 */

export type ServiceCategory =
  | "web-development"
  | "app-development"
  | "graphic-design"
  | "ai-automation"
  | "digital-marketing"
  | "cgi-ads";

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
 * Six main service offerings for Hashtag Tech
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
    title: "Graphic Designing",
    slug: "graphic-design",
    category: "graphic-design",
    shortDescription:
      "Creative visual solutions that communicate your brand's unique identity effectively",
    features: [
      "Logo & Brand Identity",
      "UI/UX Design",
      "Marketing Materials",
      "Packaging Design",
      "Custom Illustrations",
    ],
    ctaText: "Get Started",
    ctaStyle: "primary",
    order: 3,
  },
  {
    id: "4",
    title: "AI Chatbots & Automation",
    slug: "ai-automation",
    category: "ai-automation",
    shortDescription:
      "Intelligent automation solutions to streamline operations and enhance customer experience",
    features: [
      "Custom AI Chatbots",
      "Workflow Automation",
      "WhatsApp Business API",
      "CRM Integration",
      "AI Agents Setup",
    ],
    ctaText: "Get Started",
    ctaStyle: "secondary",
    order: 4,
  },
  {
    id: "5",
    title: "Digital Marketing & SEO",
    slug: "digital-marketing",
    category: "digital-marketing",
    shortDescription:
      "Data-driven strategies including SEO, social media management, and content repurposing to maximize reach",
    features: [
      "Social Media Management",
      "SEO Optimization",
      "Content Repurposing",
      "PPC Campaigns",
      "Viral Content Strategy",
    ],
    ctaText: "Get Started",
    ctaStyle: "secondary",
    order: 5,
  },
  {
    id: "6",
    title: "CGI Ads & VFX",
    slug: "cgi-ads",
    category: "cgi-ads",
    shortDescription:
      "High-end 3D commercials and visual effects that go viral and capture attention",
    features: [
      "3D Product Animation",
      "VFX for Commercials",
      "Motion Graphics",
      "Realistic Rendering",
      "Viral Social Content",
    ],
    ctaText: "Get Started",
    ctaStyle: "secondary",
    order: 6,
  },
];

export default Service;
