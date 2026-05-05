/**
 * Sanity Configuration
 *
 * Main configuration file for Sanity CMS.
 * This file must be at the project root for NextStudio to find it.
 */

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

// Import schema types from sanity folder
import { postType } from "./sanity/schemaTypes/postType";
import { authorType } from "./sanity/schemaTypes/authorType";
import { categoryType } from "./sanity/schemaTypes/categoryType";
import { careerType } from "./sanity/schemaTypes/careerType";
import { serviceType } from "./sanity/schemaTypes/serviceType";
import { aiServiceType } from "./sanity/schemaTypes/aiServiceType";
import { successStoryType } from "./sanity/schemaTypes/successStoryType";
import { teamMemberType } from "./sanity/schemaTypes/teamMemberType";
import { globalPartnerType } from "./sanity/schemaTypes/globalPartnerType";
import { clientType } from "./sanity/schemaTypes/clientType";
import { clientLogoType } from "./sanity/schemaTypes/clientLogoType";
import { ceoSectionType } from "./sanity/schemaTypes/ceoSectionType";
import { siteSettingsType } from "./sanity/schemaTypes/siteSettingsType";

// Define schema types array
const schemaTypes = [
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
  clientLogoType,
  ceoSectionType,
  siteSettingsType,
];

export default defineConfig({
  name: "hashtag-tech-cms",
  title: "Hashtag Tech CMS",

  // IMPORTANT: basePath must match the route path
  basePath: "/studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  plugins: [
    structureTool({
      structure: (S: any) =>
        S.list()
          .title("Content")
          .items([
            // Global Settings
            S.listItem()
              .title("Site Settings")
              .icon(() => "⚙️")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Site Settings")
              ),

            S.divider(),

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

            // CEO Section
            S.listItem()
              .title("CEO Section")
              .icon(() => "👤")
              .child(S.documentTypeList("ceoSection").title("CEO Section")),

            // Partners & Clients section
            S.listItem()
              .title("Partners & Clients")
              .icon(() => "🤝")
              .child(
                S.list()
                  .title("Partners & Clients")
                  .items([
                    S.listItem()
                      .title("Client/Partner Logos")
                      .schemaType("clientLogo")
                      .child(S.documentTypeList("clientLogo").title("Client/Partner Logos")),
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
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
