/**
 * Success Story Schema (Simplified)
 *
 * Sanity schema for success stories/case studies.
 * Only contains fields that are actually used on the frontend.
 */

import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export const successStoryType = defineType({
  name: "successStory",
  title: "Success Story",
  type: "document",
  icon: DocumentIcon,
  fields: [
    // Client Company Name
    defineField({
      name: "clientCompany",
      type: "string",
      validation: (Rule) => Rule.required().error("Client company name is required"),
    }),

    // Country (for display after company name)
    defineField({
      name: "country",
      type: "string",
      description: "Country code or name to display after company name (e.g., 'USA', 'UK', 'UAE')",
    }),

    // Featured Image
    defineField({
      name: "featuredImage",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          validation: (Rule) => Rule.required().error("Alt text is required"),
        },
      ],
      validation: (Rule) => Rule.required().error("Featured image is required"),
    }),

    // Excerpt/Summary
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(10).error("Excerpt must be at least 10 characters"),
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
      clientCompany: "clientCompany",
      country: "country",
      media: "featuredImage",
    },
    prepare(selection) {
      const { clientCompany, country, media } = selection;
      return {
        title: clientCompany,
        subtitle: country ? `${country} - Success Story` : "Success Story",
        media,
      };
    },
  },
});
