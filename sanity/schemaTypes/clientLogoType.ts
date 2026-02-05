/**
 * Client/Partner Logo Schema (Simplified)
 *
 * Sanity schema for client company logos displayed in the slider.
 * Only contains fields that are actually used on the frontend.
 */

import { defineType, defineField } from "sanity";
import { ImageIcon } from "@sanity/icons";

export const clientLogoType = defineType({
  name: "clientLogo",
  title: "Client/Partner Logo",
  type: "document",
  icon: ImageIcon,
  fields: [
    // Company Name
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required().error("Company name is required"),
    }),

    // Company Logo
    defineField({
      name: "logo",
      type: "image",
      options: {
        hotspot: true,
        accept: "image/png, image/jpeg, image/svg+xml, image/webp",
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          validation: (Rule) => Rule.required().error("Alt text is required"),
        },
      ],
      validation: (Rule) => Rule.required().error("Company logo is required"),
    }),

    // Website URL
    defineField({
      name: "website",
      type: "url",
      description: "Link to the company's website",
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
      media: "logo",
    },
    prepare(selection) {
      const { title, media } = selection;
      return { title, media };
    },
  },
});
