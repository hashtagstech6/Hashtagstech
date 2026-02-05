/**
 * Team Member Schema (Simplified)
 *
 * Sanity schema for team members.
 * Only contains fields that are actually used on the frontend.
 */

import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export const teamMemberType = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  icon: DocumentIcon,
  fields: [
    // Name
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required().error("Name is required"),
    }),

    // Role/Title
    defineField({
      name: "role",
      type: "string",
      validation: (Rule) => Rule.required().error("Role is required"),
    }),

    // Department
    defineField({
      name: "department",
      type: "string",
      options: {
        list: [
          { title: "Leadership", value: "leadership" },
          { title: "Development", value: "development" },
          { title: "Design", value: "design" },
          { title: "Marketing", value: "marketing" },
          { title: "Sales", value: "sales" },
          { title: "Support", value: "support" },
        ],
      },
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
      validation: (Rule) => Rule.required().error("Photo is required"),
    }),

    // Skills/Expertise
    defineField({
      name: "skills",
      type: "array",
      of: [{ type: "string" }],
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
      role: "role",
      media: "photo",
    },
    prepare(selection) {
      const { title, role, media } = selection;
      return {
        title,
        subtitle: role,
        media,
      };
    },
  },
});
