/**
 * Client Testimonial Schema (Simplified)
 *
 * Sanity schema for client testimonials.
 * Only contains fields that are actually used on the frontend.
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

    // Client Photo
    defineField({
      name: "photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          validation: (Rule) => Rule.required().error("Alt text is required"),
        },
      ],
      validation: (Rule) => Rule.required().error("Client photo is required"),
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
      title: "name",
      company: "company",
      rating: "rating",
      media: "photo",
    },
    prepare(selection) {
      const { title, company, rating, media } = selection;
      const stars = "⭐".repeat(rating || 5);
      return {
        title,
        subtitle: `${company} ${stars}`,
        media,
      };
    },
  },
});
