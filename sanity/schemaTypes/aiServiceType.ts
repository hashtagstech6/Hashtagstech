/**
 * AI Service Schema (Simplified)
 *
 * Sanity schema for AI services.
 * Only contains fields that are actually used on the frontend.
 */

import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export const aiServiceType = defineType({
  name: "aiService",
  title: "AI Service",
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

    // Number badge
    defineField({
      name: "number",
      type: "string",
      description: "Number badge (e.g., '01', '02', '03')",
      validation: (Rule) =>
        Rule.required()
          .regex(/^\d{2}$/)
          .error("Number must be 2 digits (e.g., '01', '02')"),
    }),

    // Short description
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
      description: "Lucide icon name (e.g., 'Bot', 'Brain', 'Cpu')",
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
