/**
 * Sanity Client Configuration
 *
 * Next.js Sanity client with proper configuration for ISR and caching.
 * Uses Stega for visual editing in development.
 */

import { createClient, SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId, validateSanityConfig } from "../env";

// Lazy-loaded client instance
let _client: SanityClient | null = null;

/**
 * Get Sanity client (lazy-loaded)
 * 
 * This function creates the client on first use rather than at module load,
 * which prevents build errors when Sanity is not configured.
 * 
 * @returns Sanity client or null if not configured
 */
export function getClient(): SanityClient | null {
  const config = validateSanityConfig();
  if (!config.valid) {
    return null;
  }

  if (!_client) {
    _client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false, // Disable CDN for ISR to ensure fresh content
      stega: {
        enabled: process.env.NODE_ENV === "development",
        studioUrl: "/studio",
        filter: (props) => {
          // Disable Stega for URLs to prevent hydration issues
          if (props.sourcePath.at(-1) === "url") return false;
          return props.filterDefault(props);
        },
      },
    });
  }

  return _client;
}

/**
 * Legacy client export for backward compatibility
 * WARNING: This may fail at build time if Sanity is not configured.
 * Prefer using getClient() instead for safer access.
 */
export const client = projectId ? createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  stega: {
    enabled: process.env.NODE_ENV === "development",
    studioUrl: "/studio",
    filter: (props) => {
      if (props.sourcePath.at(-1) === "url") return false;
      return props.filterDefault(props);
    },
  },
}) : null as unknown as SanityClient;

/**
 * Fetch content with GROQ query
 *
 * @param query - GROQ query string
 * @param params - Query parameters
 * @returns Fetched data
 */
export async function fetchSanity<T>(
  query: string,
  params?: Record<string, unknown>
): Promise<T> {
  const sanityClient = getClient();
  if (!sanityClient) {
    throw new Error("Sanity client is not configured");
  }
  
  if (params && Object.keys(params).length > 0) {
    return sanityClient.fetch<T>(query, params);
  }
  return sanityClient.fetch<T>(query);
}

