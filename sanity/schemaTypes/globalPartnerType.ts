/**
 * Global Partner Schema
 *
 * Sanity schema for global partners with:
 * - Partner name
 * - Logo
 * - Website URL
 * - Country/Region
 * - Partner type
 */

import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export const globalPartnerType = defineType({
  name: "globalPartner",
  title: "Global Partner",
  type: "document",
  icon: DocumentIcon,
  fields: [
    // Partner Name
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required().error("Partner name is required"),
    }),

    // Slug - auto-generated from name
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required().error("Slug is required"),
    }),

    // Logo
    defineField({
      name: "logo",
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

    // Website URL
    defineField({
      name: "website",
      type: "url",
      validation: (Rule) => Rule.required().error("Website URL is required"),
    }),

    // Country/Region
    defineField({
      name: "country",
      type: "string",
      options: {
        list: [
          { title: "United States", value: "US" },
          { title: "United Kingdom", value: "GB" },
          { title: "United Arab Emirates", value: "AE" },
          { title: "Oman", value: "OM" },
          { title: "India", value: "IN" },
          { title: "Pakistan", value: "PK" },
          { title: "Saudi Arabia", value: "SA" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required().error("Country is required"),
    }),

    // Partner Type
    defineField({
      name: "partnerType",
      type: "string",
      options: {
        list: [
          { title: "Technology Partner", value: "technology" },
          { title: "Strategic Partner", value: "strategic" },
          { title: "Client", value: "client" },
          { title: "Investor", value: "investor" },
        ],
      },
      initialValue: "client",
    }),

    // Description - optional
    defineField({
      name: "description",
      type: "text",
      rows: 2,
    }),

    // Active flag - hide inactive partners
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
      country: "country",
      media: "logo",
    },
    prepare(selection) {
      const { title, country, media } = selection;
      return {
        title,
        subtitle: country,
        media,
      };
    },
  },
});
