/**
 * Service Schema
 *
 * Sanity schema for services with:
 * - Title and slug
 * - Short description
 * - Category (web-development, app-development, social-media-marketing, ai-services)
 * - Feature list
 * - CTA text and style
 * - Display order
 */

import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export const serviceType = defineType({
  name: "service",
  title: "Service",
  type: "document",
  icon: DocumentIcon,
  fields: [
    // Title - required for display
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required().error("Title is required"),
    }),

    // Slug - auto-generated from title
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required().error("Slug is required"),
    }),

    // Category - for grouping services
    defineField({
      name: "category",
      type: "string",
      options: {
        list: [
          { title: "Web Development", value: "web-development" },
          { title: "App Development", value: "app-development" },
          { title: "Social Media Marketing", value: "social-media-marketing" },
          { title: "AI Services", value: "ai-services" },
        ],
      },
      validation: (Rule) => Rule.required().error("Category is required"),
    }),

    // Short description - for cards and listings
    defineField({
      name: "shortDescription",
      type: "text",
      rows: 3,
      validation: (Rule) =>
        Rule.required()
          .min(50)
          .max(300)
          .error("Short description must be between 50 and 300 characters"),
    }),

    // Features - bullet points for service details
    defineField({
      name: "features",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) =>
        Rule.required()
          .min(3)
          .error("At least 3 features are required"),
    }),

    // CTA Text - button text
    defineField({
      name: "ctaText",
      type: "string",
      initialValue: "Get Started",
      validation: (Rule) => Rule.required().error("CTA text is required"),
    }),

    // CTA Style - button variant
    defineField({
      name: "ctaStyle",
      type: "string",
      options: {
        list: [
          { title: "Primary (Red)", value: "primary" },
          { title: "Secondary (Outline)", value: "secondary" },
        ],
      },
      initialValue: "primary",
      validation: (Rule) => Rule.required().error("CTA style is required"),
    }),

    // Display order - for sorting
    defineField({
      name: "order",
      type: "number",
      description: "Lower numbers appear first",
      validation: (Rule) => Rule.required().min(0).error("Order must be a positive number"),
    }),

    // Icon - optional service icon
    defineField({
      name: "icon",
      type: "string",
      description: "Lucide icon name (e.g., 'Code', 'Smartphone', 'Rocket')",
    }),

    // Featured flag for highlighting services
    defineField({
      name: "featured",
      type: "boolean",
      initialValue: false,
    }),

    // Active flag - hide inactive services
    defineField({
      name: "isActive",
      type: "boolean",
      initialValue: true,
    }),
  ],

  // Preview in Studio list view
  preview: {
    select: {
      title: "title",
      category: "category",
      order: "order",
    },
    prepare(selection) {
      const { title, category, order } = selection;
      return {
        title,
        subtitle: `${category} (${order})`,
      };
    },
  },
});
