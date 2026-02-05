/**
 * Category Schema (Simplified)
 *
 * Sanity schema for blog post categories.
 * Only contains fields that are actually fetched and used on the frontend.
 */

import { defineType, defineField } from "sanity";
import { TagIcon } from "@sanity/icons";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    // Name
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required().error("Category name is required"),
    }),

    // Slug
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required().error("Slug is required"),
    }),

    // Color for category badges
    defineField({
      name: "color",
      type: "string",
      description: "Hex color for category badge (e.g., #F26B6B)",
      initialValue: "#F26B6B",
    }),
  ],

  // Preview in Studio list view
  preview: {
    select: {
      name: "name",
      color: "color",
    },
    prepare(selection) {
      const { name } = selection;
      return {
        title: name,
        subtitle: "Category",
      };
    },
  },
});
