/**
 * Author Schema (Simplified)
 *
 * Sanity schema for blog post authors.
 * Only contains fields that are actually fetched and used on the frontend.
 */

import { defineType, defineField } from "sanity";
import { UserIcon } from "@sanity/icons";

export const authorType = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    // Name
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required().error("Author name is required"),
    }),

    // Slug
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required().error("Slug is required"),
    }),

    // Photo with alt text
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          validation: (Rule) =>
            Rule.required().error("Alt text is required for accessibility"),
        },
      ],
      validation: (Rule) => Rule.required().error("Author image is required"),
    }),

    // Bio
    defineField({
      name: "bio",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().error("Bio is required"),
    }),

    // Job title
    defineField({
      name: "jobTitle",
      type: "string",
    }),
  ],

  // Preview in Studio list view
  preview: {
    select: {
      name: "name",
      media: "image",
      jobTitle: "jobTitle",
    },
    prepare(selection) {
      const { name, media, jobTitle } = selection;
      return {
        title: name,
        media,
        subtitle: jobTitle || "Author",
      };
    },
  },
});
