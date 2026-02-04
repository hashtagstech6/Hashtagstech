/**
 * AI Service Schema
 *
 * Sanity schema for AI services with:
 * - Title and slug
 * - Number badge (01, 02, 03, etc.)
 * - Short description
 * - Feature list
 * - Display order
 * - Active flag
 */

import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export const aiServiceType = defineType({
  name: "aiService",
  title: "AI Service",
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

    // Number badge - for display (01, 02, 03, etc.)
    defineField({
      name: "number",
      type: "string",
      description: "Number badge (e.g., '01', '02', '03')",
      validation: (Rule) =>
        Rule.required()
          .regex(/^\d{2}$/)
          .error("Number must be 2 digits (e.g., '01', '02')"),
    }),

    // Short description - for cards
    defineField({
      name: "shortDescription",
      type: "text",
      rows: 3,
      validation: (Rule) =>
        Rule.required()
          .min(50)
          .max(200)
          .error("Short description must be between 50 and 200 characters"),
    }),

    // Features - bullet points for AI service details
    defineField({
      name: "features",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) =>
        Rule.required()
          .min(3)
          .error("At least 3 features are required"),
    }),

    // Display order - for sorting
    defineField({
      name: "order",
      type: "number",
      description: "Lower numbers appear first",
      validation: (Rule) => Rule.required().min(0).error("Order must be a positive number"),
    }),

    // Active flag - hide inactive services
    defineField({
      name: "isActive",
      type: "boolean",
      initialValue: true,
    }),

    // Icon - optional AI service icon
    defineField({
      name: "icon",
      type: "string",
      description: "Lucide icon name (e.g., 'Bot', 'Brain', 'Cpu')",
    }),
  ],

  // Preview in Studio list view
  preview: {
    select: {
      title: "title",
      number: "number",
      order: "order",
    },
    prepare(selection) {
      const { title, number, order } = selection;
      return {
        title: `${number}: ${title}`,
        subtitle: `Order: ${order}`,
      };
    },
  },
});
