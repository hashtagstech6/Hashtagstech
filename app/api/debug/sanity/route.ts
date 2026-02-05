import { NextResponse } from "next/server";
import { getClient } from "@/sanity/lib/client";
import { validateSanityConfig, projectId, dataset } from "@/sanity/env";

/**
 * GET /api/debug/sanity
 *
 * Debug endpoint to check Sanity configuration and data.
 * This helps diagnose issues with Sanity CMS connection.
 */
export async function GET(request: Request) {
  const debugInfo: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    envVars: {
      projectId: projectId || "NOT SET",
      dataset: dataset || "NOT SET",
      nodeEnv: process.env.NODE_ENV,
    },
  };

  const config = validateSanityConfig();
  debugInfo.config = config;

  if (!config.valid) {
    debugInfo.error = config.error;
    return NextResponse.json(debugInfo);
  }

  const client = getClient();
  if (!client) {
    debugInfo.error = "Client is null after validation";
    return NextResponse.json(debugInfo);
  }

  debugInfo.clientStatus = "Client created successfully";

  // Try to fetch all documents to see what's available
  try {
    // Fetch all document types and counts
    const typesQuery = `
      {
        "allTypes": array::unique(*[_type in ["successStory", "client", "globalPartner", "clientLogo", "teamMember", "service", "blogPost", "author", "category", "career"]]._type),
        "counts": {
          "successStory": count(*[_type == "successStory"]),
          "client": count(*[_type == "client"]),
          "globalPartner": count(*[_type == "globalPartner"]),
          "clientLogo": count(*[_type == "clientLogo"]),
          "teamMember": count(*[_type == "teamMember"]),
          "service": count(*[_type == "service"]),
          "blogPost": count(*[_type == "blogPost"]),
          "author": count(*[_type == "author"]),
          "category": count(*[_type == "category"]),
          "career": count(*[_type == "career"]),
        }
      }
    `;

    const typesResult = await client.fetch(typesQuery);
    debugInfo.documentTypes = typesResult;

    // Fetch a sample success story
    const sampleStoryQuery = `*[_type == "successStory"][0...3] {
      _id,
      _createdAt,
      clientCompany,
      country,
      isActive,
      excerpt
    }`;
    const sampleStories = await client.fetch(sampleStoryQuery);
    debugInfo.sampleSuccessStories = sampleStories;

    // Check active success stories specifically
    const activeStoriesQuery = `*[_type == "successStory" && isActive == true] {
      _id,
      clientCompany,
      country,
      isActive
    }`;
    const activeStories = await client.fetch(activeStoriesQuery);
    debugInfo.activeSuccessStories = activeStories;

    // Check for stories without isActive field (older documents)
    const missingIsActiveQuery = `*[_type == "successStory" && defined(isActive) == false] {
      _id,
      clientCompany,
      country,
      isActive
    }`;
    const missingIsActive = await client.fetch(missingIsActiveQuery);
    debugInfo.storiesWithoutIsActive = missingIsActive;

    // Test the actual query used by the API
    const apiQueryQuery = `*[_type == "successStory" && (isActive == true || defined(isActive) == false)] | order(_createdAt asc)[0...10] {
      _id,
      clientCompany,
      country,
      featuredImage {
        asset-> {
          _id,
          url
        },
        alt
      },
      excerpt
    }`;
    const apiQueryResult = await client.fetch(apiQueryQuery);
    debugInfo.apiQueryResult = apiQueryResult;

    // Fetch team members
    const teamQuery = `*[_type == "teamMember" && (isActive == true || defined(isActive) == false)] | order(order asc) {
      _id,
      name,
      role,
      department,
      photo {
        asset-> {
          _id,
          url
        },
        alt
      },
      isActive,
      order
    }`;
    const teamResult = await client.fetch(teamQuery);
    debugInfo.teamMembers = teamResult;

  } catch (error) {
    debugInfo.fetchError = error instanceof Error ? error.message : String(error);
  }

  return NextResponse.json(debugInfo);
}
