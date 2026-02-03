/**
 * Author Schema
 *
 * Sanity schema for blog post authors.
 * Each author has a name, photo, bio, and slug for profile pages.
 */

import { defineType, defineField } from "sanity";
import { UserIcon } from "@sanity/icons";

export const authorType = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    // Name - required
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required().error("Author name is required"),
    }),

    // Slug - auto-generated from name
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
    }),

    // Bio - short biography
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

    // Email (optional)
    defineField({
      name: "email",
      type: "email",
    }),

    // Twitter/X handle
    defineField({
      name: "twitter",
      type: "string",
      description: "Twitter/X username (without @)",
    }),

    // LinkedIn URL
    defineField({
      name: "linkedin",
      type: "url",
    }),

    // GitHub URL
    defineField({
      name: "github",
      type: "url",
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
