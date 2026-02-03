/**
 * Category Schema
 *
 * Sanity schema for blog post categories.
 * Categories organize blog posts by topic.
 */

import { defineType, defineField } from "sanity";
import { TagIcon } from "@sanity/icons";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    // Name - required
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required().error("Category name is required"),
    }),

    // Slug - auto-generated from name
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required().error("Slug is required"),
    }),

    // Description
    defineField({
      name: "description",
      type: "text",
      rows: 2,
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
      description: "description",
      color: "color",
    },
    prepare(selection) {
      const { name, description } = selection;
      return {
        title: name,
        subtitle: description || "Category",
      };
    },
  },
});
