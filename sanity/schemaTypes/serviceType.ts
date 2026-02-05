/**
 * Service Schema (Simplified)
 *
 * Sanity schema for services.
 * Only contains fields that are actually used on the frontend.
 */

import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export const serviceType = defineType({
  name: "service",
  title: "Service",
  type: "document",
  icon: DocumentIcon,
  fields: [
    // Title
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required().error("Title is required"),
    }),

    // Slug
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required().error("Slug is required"),
    }),

    // Category
    defineField({
      name: "category",
      type: "string",
      options: {
        list: [
          { title: "Web Development", value: "web-development" },
          { title: "App Development", value: "app-development" },
          { title: "Social Media Marketing", value: "social-media-marketing" },
          { title: "AI Services", value: "ai-services" },
          { title: "Creative & Design", value: "creative-design" },
        ],
      },
      validation: (Rule) => Rule.required().error("Category is required"),
    }),

    // Short description
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

    // Features
    defineField({
      name: "features",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) =>
        Rule.required()
          .min(3)
          .error("At least 3 features are required"),
    }),

    // CTA Text
    defineField({
      name: "ctaText",
      type: "string",
      initialValue: "Get Started",
      validation: (Rule) => Rule.required().error("CTA text is required"),
    }),

    // CTA Style
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

    // Display order
    defineField({
      name: "order",
      type: "number",
      description: "Lower numbers appear first",
      validation: (Rule) => Rule.required().min(0).error("Order must be a positive number"),
    }),

    // Icon
    defineField({
      name: "icon",
      type: "string",
      description: "Lucide icon name (e.g., 'Code', 'Smartphone', 'Rocket')",
    }),

    // Active flag
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
