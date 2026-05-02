/**
 * CEO Section Schema
 *
 * Sanity schema for the CEO message section on the homepage.
 * Allows editing the CEO's photo, name, message text, consultation details,
 * and social links. Only social links with a URL will be displayed on the frontend.
 */

import { defineType, defineField } from "sanity";
import { UserIcon } from "@sanity/icons";

export const ceoSectionType = defineType({
  name: "ceoSection",
  title: "CEO Section",
  type: "document",
  icon: UserIcon,
  fields: [
    // CEO Name
    defineField({
      name: "name",
      title: "CEO Name",
      type: "string",
      validation: (Rule) => Rule.required().error("CEO name is required"),
    }),

    // Section Title (e.g. "Message From The CEO")
    defineField({
      name: "sectionTitle",
      title: "Section Title",
      type: "string",
      initialValue: "Message From The CEO",
    }),

    // CEO Photo
    defineField({
      name: "photo",
      title: "CEO Photo",
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
      validation: (Rule) => Rule.required().error("CEO photo is required"),
    }),

    // CEO Message (rich text)
    defineField({
      name: "message",
      title: "Message",
      type: "array",
      of: [{ type: "block" }],
      description: "The CEO's message. Use H2 for the main heading, Blockquote for the highlighted quote, and Bold/Italics as needed.",
      validation: (Rule) => Rule.required().error("Message is required"),
    }),

    // Consultation Text
    defineField({
      name: "consultationText",
      title: "Consultation Offer Text",
      type: "string",
      description: "e.g. 'Offering 1:1 Discovery Session for Business Owners...'",
    }),

    // Consultation Price
    defineField({
      name: "consultationPrice",
      title: "Consultation Price",
      type: "string",
      description: "e.g. '$286'",
    }),

    // Consultation Button Text
    defineField({
      name: "consultationButtonText",
      title: "Consultation Button Text",
      type: "string",
      description: "e.g. 'Pay $286 & Unlock'",
      initialValue: "Pay $286 & Unlock",
    }),

    // Consultation Link
    defineField({
      name: "consultationLink",
      title: "Consultation Link",
      type: "url",
      description: "URL for the consultation payment/booking page",
    }),

    // --- Social Links (all optional) ---
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
      description: "Leave empty to hide this icon",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }).error("Must be a valid URL"),
    }),

    defineField({
      name: "twitterUrl",
      title: "Twitter / X URL",
      type: "url",
      description: "Leave empty to hide this icon",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }).error("Must be a valid URL"),
    }),

    defineField({
      name: "facebookUrl",
      title: "Facebook URL",
      type: "url",
      description: "Leave empty to hide this icon",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }).error("Must be a valid URL"),
    }),

    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      description: "Leave empty to hide this icon",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }).error("Must be a valid URL"),
    }),

    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
      description: "Leave empty to hide this icon",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }).error("Must be a valid URL"),
    }),

    defineField({
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
      description: "Leave empty to hide this icon",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }).error("Must be a valid URL"),
    }),

    defineField({
      name: "websiteUrl",
      title: "Personal Website URL",
      type: "url",
      description: "Leave empty to hide this icon",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }).error("Must be a valid URL"),
    }),

    // Active flag
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Toggle to show/hide the CEO section on the website",
    }),
  ],

  // Preview in Studio list view
  preview: {
    select: {
      title: "name",
      subtitle: "sectionTitle",
      media: "photo",
    },
  },
});
