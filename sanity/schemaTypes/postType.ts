/**
 * Blog Post Schema
 *
 * Sanity schema for blog posts with:
 * - Title and slug
 * - Featured image with alt text
 * - Excerpt and content (Portable Text)
 * - Author reference
 * - Category references
 * - SEO metadata
 * - Publication date
 */

import { defineType, defineField, defineArrayMember } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export const postType = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  icon: DocumentIcon,
  fields: [
    // Title - required for display
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required().error("Title is required"),
    }),

    // Slug - auto-generated from title
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required().error("Slug is required"),
    }),

    // Main image with hotspot and alt text
    defineField({
      name: "mainImage",
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

    // Excerpt - short summary for listing pages
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      validation: (Rule) =>
        Rule.required()
          .min(50)
          .max(300)
          .error("Excerpt must be between 50 and 300 characters"),
    }),

    // Content - Portable Text for rich content
    defineField({
      name: "content",
      type: "array",
      of: [
        // Text blocks with rich formatting
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 1", value: "h1" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Heading 4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
              { title: "Underline", value: "underline" },
              { title: "Strikethrough", value: "s" },
            ],
            annotations: [
              {
                title: "URL",
                name: "link",
                type: "object",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url",
                  },
                ],
              },
            ],
          },
        }),
        // Inline images in content
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative Text",
            },
          ],
        }),
      ],
      validation: (Rule) => Rule.required().error("Content is required"),
    }),

    // Author - reference to author document
    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (Rule) => Rule.required().error("Author is required"),
    }),

    // Categories - array of category references
    defineField({
      name: "categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      validation: (Rule) => Rule.required().min(1).error("At least one category is required"),
    }),

    // Published date
    defineField({
      name: "publishedAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required().error("Publication date is required"),
    }),

    // SEO Title - override for search engines
    defineField({
      name: "seoTitle",
      type: "string",
      description: "Override page title for SEO (60 chars max)",
      validation: (Rule) => Rule.max(60),
    }),

    // SEO Description - meta description
    defineField({
      name: "seoDescription",
      type: "text",
      rows: 2,
      description: "Meta description for search engines (160 chars max)",
      validation: (Rule) => Rule.max(160),
    }),

    // Featured flag for highlighting posts
    defineField({
      name: "featured",
      type: "boolean",
      initialValue: false,
    }),

    // Reading time (auto-calculated, can be overridden)
    defineField({
      name: "readingTime",
      type: "number",
      description: "Reading time in minutes (auto-calculated if empty)",
    }),
  ],

  // Preview in Studio list view
  preview: {
    select: {
      title: "title",
      media: "mainImage",
      subtitle: "publishedAt",
    },
    prepare(selection) {
      const { title, media, subtitle } = selection;
      return {
        title,
        media,
        subtitle: new Date(subtitle).toLocaleDateString(),
      };
    },
  },
});
