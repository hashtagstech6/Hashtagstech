/**
 * Sanity Configuration
 *
 * Main configuration file for Sanity CMS.
 * Defines the schema types and project settings.
 */

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

// Import schema types
import { postType } from "./schemaTypes/postType";
import { authorType } from "./schemaTypes/authorType";
import { categoryType } from "./schemaTypes/categoryType";
import { careerType } from "./schemaTypes/careerType";

// Define schema types array
export const schemaTypes = [postType, authorType, categoryType, careerType];

/**
 * Sanity configuration
 */
export default defineConfig({
  name: "hashtag-tech-cms",
  title: "Hashtag Tech CMS",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  plugins: [
    structureTool({
      structure: (S: any) =>
        S.list()
          .title("Content")
          .items([
            // Blog section
            S.listItem()
              .title("Blog")
              .icon(() => "📝")
              .child(
                S.list()
                  .title("Blog")
                  .items([
                    S.listItem()
                      .title("All Posts")
                      .schemaType("post")
                      .child(S.documentTypeList("post").title("All Posts")),
                    S.listItem()
                      .title("Authors")
                      .schemaType("author")
                      .child(S.documentTypeList("author").title("Authors")),
                    S.listItem()
                      .title("Categories")
                      .schemaType("category")
                      .child(S.documentTypeList("category").title("Categories")),
                  ])
              ),

            // Careers section
            S.listItem()
              .title("Careers")
              .icon(() => "💼")
              .child(S.documentTypeList("career").title("Job Openings")),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
