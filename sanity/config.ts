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
import { serviceType } from "./schemaTypes/serviceType";
import { aiServiceType } from "./schemaTypes/aiServiceType";
import { successStoryType } from "./schemaTypes/successStoryType";
import { teamMemberType } from "./schemaTypes/teamMemberType";
import { globalPartnerType } from "./schemaTypes/globalPartnerType";
import { clientType } from "./schemaTypes/clientType";

// Define schema types array
export const schemaTypes = [
  postType,
  authorType,
  categoryType,
  careerType,
  serviceType,
  aiServiceType,
  successStoryType,
  teamMemberType,
  globalPartnerType,
  clientType,
];

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

            // Services section
            S.listItem()
              .title("Services")
              .icon(() => "🚀")
              .child(
                S.list()
                  .title("Services")
                  .items([
                    S.listItem()
                      .title("All Services")
                      .schemaType("service")
                      .child(S.documentTypeList("service").title("All Services")),
                    S.listItem()
                      .title("AI Services")
                      .schemaType("aiService")
                      .child(S.documentTypeList("aiService").title("AI Services")),
                  ])
              ),

            // Success Stories section
            S.listItem()
              .title("Success Stories")
              .icon(() => "⭐")
              .child(S.documentTypeList("successStory").title("Success Stories")),

            // Team section
            S.listItem()
              .title("Team")
              .icon(() => "👥")
              .child(S.documentTypeList("teamMember").title("Team Members")),

            // Partners & Clients section
            S.listItem()
              .title("Partners & Clients")
              .icon(() => "🤝")
              .child(
                S.list()
                  .title("Partners & Clients")
                  .items([
                    S.listItem()
                      .title("Global Partners")
                      .schemaType("globalPartner")
                      .child(S.documentTypeList("globalPartner").title("Global Partners")),
                    S.listItem()
                      .title("Client Testimonials")
                      .schemaType("client")
                      .child(S.documentTypeList("client").title("Client Testimonials")),
                  ])
              ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
