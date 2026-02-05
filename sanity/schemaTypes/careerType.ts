/**
 * Career Schema (Simplified)
 *
 * Sanity schema for job postings/career opportunities.
 * Only contains fields that are actually fetched and used on the frontend.
 */

import { defineType, defineField } from "sanity";

export const careerType = defineType({
  name: "career",
  title: "Job Opening",
  type: "document",
  fields: [
    // Job Title
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required().error("Job title is required"),
    }),

    // Slug
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required().error("Slug is required"),
    }),

    // Department
    defineField({
      name: "department",
      type: "string",
      options: {
        list: [
          { title: "Engineering", value: "Engineering" },
          { title: "Design", value: "Design" },
          { title: "Marketing", value: "Marketing" },
          { title: "Sales", value: "Sales" },
          { title: "Operations", value: "Operations" },
          { title: "HR", value: "HR" },
          { title: "Other", value: "Other" },
        ],
      },
      validation: (Rule) => Rule.required().error("Department is required"),
    }),

    // Location
    defineField({
      name: "location",
      type: "string",
      validation: (Rule) => Rule.required().error("Location is required"),
    }),

    // Employment Type
    defineField({
      name: "type",
      type: "string",
      options: {
        list: [
          { title: "Full-time", value: "Full-time" },
          { title: "Part-time", value: "Part-time" },
          { title: "Contract", value: "Contract" },
          { title: "Remote", value: "Remote" },
          { title: "Internship", value: "Internship" },
        ],
      },
      initialValue: "Full-time",
      validation: (Rule) => Rule.required().error("Employment type is required"),
    }),

    // Job Description
    defineField({
      name: "description",
      type: "text",
      rows: 10,
      validation: (Rule) => Rule.required().error("Job description is required"),
    }),

    // Requirements
    defineField({
      name: "requirements",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .error("At least one requirement is required"),
    }),

    // Benefits
    defineField({
      name: "benefits",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .error("At least one benefit is required"),
    }),

    // Salary Range
    defineField({
      name: "salary",
      type: "object",
      fields: [
        {
          name: "min",
          type: "number",
          title: "Minimum Salary",
        },
        {
          name: "max",
          type: "number",
          title: "Maximum Salary",
        },
        {
          name: "currency",
          type: "string",
          title: "Currency",
          options: {
            list: [
              { title: "USD ($)", value: "USD" },
              { title: "EUR (€)", value: "EUR" },
              { title: "GBP (£)", value: "GBP" },
              { title: "AED (د.إ)", value: "AED" },
            ],
          },
          initialValue: "USD",
        },
        {
          name: "period",
          type: "string",
          title: "Period",
          options: {
            list: [
              { title: "Per Year", value: "yearly" },
              { title: "Per Month", value: "monthly" },
              { title: "Per Hour", value: "hourly" },
            ],
          },
          initialValue: "yearly",
        },
      ],
    }),

    // Active status
    defineField({
      name: "isActive",
      type: "boolean",
      initialValue: true,
      validation: (Rule) => Rule.required().error("Active status is required"),
    }),

    // Published date
    defineField({
      name: "publishedAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required().error("Publication date is required"),
    }),

    // Application URL
    defineField({
      name: "applicationUrl",
      type: "url",
      description: "External application URL (optional - uses default contact form if empty)",
    }),

    // Application email
    defineField({
      name: "applicationEmail",
      type: "email",
      description: "Application email (optional - uses default contact email if empty)",
    }),
  ],

  // Preview in Studio list view
  preview: {
    select: {
      title: "title",
      department: "department",
      location: "location",
      type: "type",
      isActive: "isActive",
    },
    prepare(selection) {
      const { title, department, location, type, isActive } = selection;
      return {
        title,
        subtitle: `${department} • ${location} • ${type}${!isActive ? " (Inactive)" : ""}`,
      };
    },
  },
});
