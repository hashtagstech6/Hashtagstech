/**
 * Client/Testimonial Schema
 *
 * Sanity schema for client testimonials with:
 * - Client name and company
 * - Photo
 * - Rating
 * - Quote/testimonial
 * - Project or service provided
 */

import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export const clientType = defineType({
  name: "client",
  title: "Client Testimonial",
  type: "document",
  icon: DocumentIcon,
  fields: [
    // Client Name
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required().error("Client name is required"),
    }),

    // Slug - auto-generated from name
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required().error("Slug is required"),
    }),

    // Company Name
    defineField({
      name: "company",
      type: "string",
      validation: (Rule) => Rule.required().error("Company name is required"),
    }),

    // Role/Position
    defineField({
      name: "role",
      type: "string",
    }),

    // Photo
    defineField({
      name: "photo",
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

    // Rating (1-5 stars)
    defineField({
      name: "rating",
      type: "number",
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(5)
          .integer()
          .error("Rating must be between 1 and 5"),
      initialValue: 5,
    }),

    // Quote/Testimonial
    defineField({
      name: "quote",
      type: "text",
      rows: 5,
      validation: (Rule) =>
        Rule.required()
          .min(20)
          .error("Quote must be at least 20 characters"),
    }),

    // Project/Service provided
    defineField({
      name: "project",
      type: "string",
      description: "The project or service provided to this client",
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

    // Case Study Link (if exists)
    defineField({
      name: "caseStudy",
      type: "reference",
      to: [{ type: "successStory" }],
    }),

    // Featured flag for homepage highlighting
    defineField({
      name: "featured",
      type: "boolean",
      initialValue: false,
    }),

    // Active flag
    defineField({
      name: "isActive",
      type: "boolean",
      initialValue: true,
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
      title: "name",
      company: "company",
      rating: "rating",
      media: "photo",
    },
    prepare(selection) {
      const { title, company, rating, media } = selection;
      // Generate star display for preview
      const stars = "⭐".repeat(rating || 5);
      return {
        title,
        subtitle: `${company} ${stars}`,
        media,
      };
    },
  },
});
