/**
 * Team Member Schema
 *
 * Sanity schema for team members with:
 * - Name and role
 * - Photo
 * - Bio
 * - Social links
 * - Department
 */

import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export const teamMemberType = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  icon: DocumentIcon,
  fields: [
    // Name - required for display
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required().error("Name is required"),
    }),

    // Slug - auto-generated from name
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required().error("Slug is required"),
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
    }),

    // Short Bio - for team page
    defineField({
      name: "bio",
      type: "text",
      rows: 5,
      validation: (Rule) =>
        Rule.required()
          .min(50)
          .error("Bio must be at least 50 characters"),
    }),

    // Full Bio - for individual profile page
    defineField({
      name: "fullBio",
      type: "array",
      of: [{ type: "block" }],
    }),

    // Skills/Expertise
    defineField({
      name: "skills",
      type: "array",
      of: [{ type: "string" }],
    }),

    // Email
    defineField({
      name: "email",
      type: "email",
    }),

    // LinkedIn URL
    defineField({
      name: "linkedinUrl",
      type: "url",
    }),

    // Twitter/X URL
    defineField({
      name: "twitterUrl",
      type: "url",
    }),

    // GitHub URL (for developers)
    defineField({
      name: "githubUrl",
      type: "url",
    }),

    // Featured flag for leadership/highlighted members
    defineField({
      name: "featured",
      type: "boolean",
      initialValue: false,
    }),

    // Active flag - hide former employees
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
