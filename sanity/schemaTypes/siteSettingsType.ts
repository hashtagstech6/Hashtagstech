import { defineType, defineField } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "logo",
      title: "Main Logo",
      type: "image",
      description: "The primary logo used in the header. Recommended dimensions: 240x80px (3:1 aspect ratio).",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          initialValue: "Hashtag Tech Logo",
        },
      ],
    }),
    defineField({
      name: "footerLogo",
      title: "Footer Logo",
      type: "image",
      description: "Logo used in the footer (usually a white/light version). Recommended dimensions: 240x80px (3:1 aspect ratio).",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          initialValue: "Hashtag Tech Logo",
        },
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "Twitter / X", value: "twitter" },
                  { title: "Facebook", value: "facebook" },
                  { title: "Instagram", value: "instagram" },
                  { title: "GitHub", value: "github" },
                  { title: "YouTube", value: "youtube" },
                ],
              },
            },
            {
              name: "url",
              title: "URL",
              type: "url",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "contactEmails",
      title: "Contact Emails",
      type: "array",
      description: "Manage email addresses shown in Footer and Contact pages.",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string", initialValue: "General Inquiries" },
            { name: "email", title: "Email Address", type: "string" },
          ],
        },
      ],
    }),
    defineField({
      name: "privacyPolicy",
      title: "Privacy Policy",
      type: "array",
      of: [{ type: "block" }],
      description: "Content for the Privacy Policy page.",
    }),
    defineField({
      name: "termsOfService",
      title: "Terms of Service",
      type: "array",
      of: [{ type: "block" }],
      description: "Content for the Terms of Service page.",
    }),
  ],
});
