/**
 * Success Story Schema
 *
 * Sanity schema for success stories/case studies with:
 * - Title and slug
 * - Client name and company
 * - Featured image
 * - Excerpt and full content
 * - Results/metrics
 * - Category
 */

import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export const successStoryType = defineType({
  name: "successStory",
  title: "Success Story",
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

    // Client Name
    defineField({
      name: "clientName",
      type: "string",
      validation: (Rule) => Rule.required().error("Client name is required"),
    }),

    // Client Company
    defineField({
      name: "clientCompany",
      type: "string",
      validation: (Rule) => Rule.required().error("Client company is required"),
    }),

    // Industry
    defineField({
      name: "industry",
      type: "string",
      options: {
        list: [
          { title: "Technology", value: "technology" },
          { title: "Finance", value: "finance" },
          { title: "Healthcare", value: "healthcare" },
          { title: "E-commerce", value: "ecommerce" },
          { title: "Education", value: "education" },
          { title: "Other", value: "other" },
        ],
      },
    }),

    // Featured image with hotspot and alt text
    defineField({
      name: "featuredImage",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          validation: (Rule) => Rule.required().error("Alt text is required for accessibility"),
        },
      ],
    }),

    // Excerpt - short summary for cards
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      validation: (Rule) =>
        Rule.required()
          .min(50)
          .max(300)
          .error("Excerpt must be between 50 and 300 characters"),
    }),

    // Content - Portable Text for full case study
    defineField({
      name: "content",
      type: "array",
      of: [{ type: "block" }],
    }),

    // Challenge
    defineField({
      name: "challenge",
      type: "text",
      rows: 3,
      description: "The client's challenge or problem",
    }),

    // Solution
    defineField({
      name: "solution",
      type: "text",
      rows: 3,
      description: "How Hashtag Tech solved the problem",
    }),

    // Results - key metrics/outcomes
    defineField({
      name: "results",
      type: "array",
      of: [
        defineField({
          name: "result",
          type: "object",
          fields: [
            { name: "metric", type: "string", title: "Metric (e.g., '50% increase')" },
            { name: "label", type: "string", title: "Label (e.g., 'in conversion')" },
          ],
        }),
      ],
    }),

    // Project Date
    defineField({
      name: "projectDate",
      type: "date",
    }),

    // Services Used - for categorization
    defineField({
      name: "services",
      type: "array",
      of: [
        defineField({
          name: "service",
          type: "string",
          options: {
            list: [
              { title: "Web Development", value: "web-development" },
              { title: "App Development", value: "app-development" },
              { title: "AI Solutions", value: "ai-solutions" },
              { title: "Digital Marketing", value: "digital-marketing" },
            ],
          },
        }),
      ],
    }),

    // Featured flag for highlighting success stories
    defineField({
      name: "featured",
      type: "boolean",
      initialValue: false,
    }),

    // Display order
    defineField({
      name: "order",
      type: "number",
      description: "Lower numbers appear first",
    }),
  ],

  // Preview in Studio list view
  preview: {
    select: {
      title: "title",
      clientName: "clientName",
      clientCompany: "clientCompany",
      media: "featuredImage",
    },
    prepare(selection) {
      const { title, clientName, clientCompany, media } = selection;
      return {
        title,
        subtitle: `${clientName} - ${clientCompany}`,
        media,
      };
    },
  },
});
