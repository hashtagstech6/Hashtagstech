/**
 * Global Partner Schema (Simplified)
 *
 * Sanity schema for global partners (representatives in different countries).
 * Only contains fields that are actually used on the frontend.
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

    // Partner Photo (person's photo)
    defineField({
      name: "photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          validation: (Rule) => Rule.required().error("Alt text is required"),
        },
      ],
      validation: (Rule) => Rule.required().error("Partner photo is required"),
    }),

    // Country/Region
    defineField({
      name: "country",
      type: "string",
      options: {
        list: [
          // North America
          { title: "United States", value: "US" },
          { title: "Canada", value: "CA" },
          { title: "Mexico", value: "MX" },

          // South America
          { title: "Brazil", value: "BR" },
          { title: "Argentina", value: "AR" },
          { title: "Colombia", value: "CO" },
          { title: "Chile", value: "CL" },

          // Europe
          { title: "United Kingdom", value: "GB" },
          { title: "Germany", value: "DE" },
          { title: "France", value: "FR" },
          { title: "Italy", value: "IT" },
          { title: "Spain", value: "ES" },
          { title: "Netherlands", value: "NL" },
          { title: "Switzerland", value: "CH" },
          { title: "Sweden", value: "SE" },
          { title: "Norway", value: "NO" },
          { title: "Denmark", value: "DK" },
          { title: "Poland", value: "PL" },
          { title: "Belgium", value: "BE" },
          { title: "Austria", value: "AT" },

          // Middle East
          { title: "United Arab Emirates", value: "AE" },
          { title: "Saudi Arabia", value: "SA" },
          { title: "Qatar", value: "QA" },
          { title: "Kuwait", value: "KW" },
          { title: "Oman", value: "OM" },
          { title: "Bahrain", value: "BH" },
          { title: "Israel", value: "IL" },
          { title: "Turkey", value: "TR" },
          { title: "Egypt", value: "EG" },

          // Asia Pacific
          { title: "India", value: "IN" },
          { title: "Pakistan", value: "PK" },
          { title: "China", value: "CN" },
          { title: "Japan", value: "JP" },
          { title: "South Korea", value: "KR" },
          { title: "Singapore", value: "SG" },
          { title: "Hong Kong", value: "HK" },
          { title: "Malaysia", value: "MY" },
          { title: "Thailand", value: "TH" },
          { title: "Indonesia", value: "ID" },
          { title: "Philippines", value: "PH" },
          { title: "Vietnam", value: "VN" },
          { title: "Australia", value: "AU" },
          { title: "New Zealand", value: "NZ" },

          // Africa
          { title: "South Africa", value: "ZA" },
          { title: "Nigeria", value: "NG" },
          { title: "Kenya", value: "KE" },
          { title: "Morocco", value: "MA" },

          // Others
          { title: "Russia", value: "RU" },
          { title: "Ukraine", value: "UA" },
        ],
      },
      validation: (Rule) => Rule.required().error("Country is required"),
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
      country: "country",
      media: "photo",
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
