/**
 * Sanity Client Configuration
 *
 * Next.js Sanity client with proper configuration for ISR and caching.
 * Uses Stega for visual editing in development.
 */

import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

/**
 * Sanity client for fetching content
 *
 * Configuration:
 * - projectId: Sanity project ID from environment
 * - dataset: Content dataset (default: "production")
 * - apiVersion: API version to use
 * - useCdn: false (disabled for ISR - ensures fresh content)
 * - stega: enabled for visual editing in development
 */
export const client = createClient({
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
  if (params && Object.keys(params).length > 0) {
    return client.fetch<T>(query, params);
  }
  return client.fetch<T>(query);
}
